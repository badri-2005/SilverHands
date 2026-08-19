import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Screen, UserRole, AppUser, ChatThread, Provider } from './types';
import { PROVIDERS } from './mockData';
import { supabase, type ProfileRow } from './lib/supabase';

interface AppState {
  screen: Screen;
  navigate: (s: Screen, params?: Record<string, string>) => void;
  goBack: () => void;
  params: Record<string, string>;
  user: AppUser | null;
  setUser: (u: AppUser | null) => void;
  authLoading: boolean;
  selectedProvider: Provider | null;
  setSelectedProvider: (p: Provider | null) => void;
  savedProviders: string[];
  toggleSave: (id: string) => void;
  threads: ChatThread[];
  openChat: (providerId: string) => void;
  currentThreadId: string | null;
  sendMessage: (text: string, voice?: boolean) => void;
  locationEnabled: boolean;
  enableLocation: () => void;
  radius: number;
  setRadius: (r: number) => void;
  connectedUserIds: string[];
}

const AppContext = createContext<AppState | null>(null);

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 't1',
    providerId: 'p1',
    lastMessage: 'Yes, I can prepare 5 tiffin boxes by tomorrow morning.',
    lastTime: '12:30 PM',
    unread: 2,
    messages: [
      { id: 'm1', fromMe: true, text: 'Hi Lakshmi, can you prepare tiffin for 5 people tomorrow?', time: '11:00 AM' },
      { id: 'm2', fromMe: false, text: 'Namaskara! Yes, what items would you like?', time: '11:15 AM' },
      { id: 'm3', fromMe: true, text: 'Idli and chutney, and some pongal if possible.', time: '11:20 AM' },
      { id: 'm4', fromMe: false, text: 'Sure, I can make fresh pongal too. When do you need it?', time: '11:45 AM' },
      { id: 'm5', fromMe: true, text: 'By 8 AM please.', time: '12:00 PM' },
      { id: 'm6', fromMe: false, text: 'Yes, I can prepare 5 tiffin boxes by tomorrow morning.', time: '12:30 PM' },
    ],
  },
  {
    id: 't2',
    providerId: 'p2',
    lastMessage: 'Saturday 5 PM works. I will send the first lesson plan.',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 'm1', fromMe: true, text: 'My daughter needs help with Class 10 algebra. Are you available on weekends?', time: 'Yesterday' },
      { id: 'm2', fromMe: false, text: 'Yes, Saturday and Sunday afternoons are open. What syllabus?', time: 'Yesterday' },
      { id: 'm3', fromMe: false, text: 'Saturday 5 PM works. I will send the first lesson plan.', time: 'Yesterday' },
    ],
  },
];

function profileRowToUser(p: ProfileRow): AppUser {
  return {
    id: p.id,
    email: p.email,
    name: p.name,
    phone: p.phone,
    address: p.address,
    role: (p.role as UserRole) || 'find',
    onboarded: p.onboarded,
    profile: {
      skillTitle: p.skill_title,
      bio: p.bio,
      skills: p.skills,
      languages: p.languages,
      category: p.category as any,
      experienceYears: p.experience_years,
      locationArea: p.location_area,
    },
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('home');
  const [params, setParams] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Screen[]>([]);
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [savedProviders, setSavedProviders] = useState<string[]>(['p2']);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [radius, setRadius] = useState(7);
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        if (mounted && profile) {
          setUser(profileRowToUser(profile as ProfileRow));
        }
      }
      setAuthLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          if (mounted && profile) {
            setUser(profileRowToUser(profile as ProfileRow));
          }
        } else {
          if (mounted) setUser(null);
        }
        setAuthLoading(false);
      })();
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const navigate = useCallback((s: Screen, p: Record<string, string> = {}) => {
    setScreen(prev => {
      setHistory(h => [...h, prev]);
      return s;
    });
    setParams(p);
  }, []);

  const goBack = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) {
        setScreen('home');
        return h;
      }
      const prev = h[h.length - 1];
      setScreen(prev);
      return h.slice(0, -1);
    });
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSavedProviders(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }, []);

  const openChat = useCallback((providerId: string) => {
    setThreads(prev => {
      const existing = prev.find(t => t.providerId === providerId);
      if (existing) {
        setCurrentThreadId(existing.id);
        return prev;
      }
      const newThread: ChatThread = {
        id: `t${Date.now()}`,
        providerId,
        lastMessage: '',
        lastTime: 'Now',
        unread: 0,
        messages: [],
      };
      setCurrentThreadId(newThread.id);
      return [newThread, ...prev];
    });
  }, []);

  const sendMessage = useCallback(
    (text: string, voice = false) => {
      if (!currentThreadId) return;
      const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      setThreads(prev =>
        prev.map(t => {
          if (t.id !== currentThreadId) return t;
          const replyText = voice ? 'I received your voice message. Let me get back to you shortly.' : 'Thank you for your message! I will get back to you soon.';
          const reply: ChatThread['messages'][number] = { id: `m${Date.now()}r`, fromMe: false, text: replyText, time: now };
          return {
            ...t,
            lastMessage: voice ? 'Voice message' : text,
            lastTime: now,
            messages: [
              ...t.messages,
              { id: `m${Date.now()}`, fromMe: true, text, time: now, voice, duration: voice ? '0:12' : undefined },
              reply,
            ],
          };
        })
      );
    },
    [currentThreadId]
  );

  const enableLocation = useCallback(() => setLocationEnabled(true), []);

  return (
    <AppContext.Provider
      value={{
        screen,
        navigate,
        goBack,
        params,
        user,
        setUser,
        authLoading,
        selectedProvider,
        setSelectedProvider,
        savedProviders,
        toggleSave,
        threads,
        openChat,
        currentThreadId,
        sendMessage,
        locationEnabled,
        enableLocation,
        radius,
        setRadius,
        connectedUserIds,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function getProvider(id: string): Provider | undefined {
  return PROVIDERS.find(p => p.id === id);
}
