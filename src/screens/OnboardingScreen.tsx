import { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { supabase } from '../lib/supabase';
import { Mic, Sparkles, Check, ChevronRight, Loader2, Volume2, MapPin, Globe, Phone, Home, ChevronLeft } from 'lucide-react';
import type { Provider, Category } from '../types';

const LANGUAGES = [
  { code: 'en-IN', label: 'English' },
  { code: 'hi-IN', label: 'हिंदी' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ' },
  { code: 'ta-IN', label: 'தமிழ்' },
  { code: 'te-IN', label: 'తెలుగు' },
  { code: 'mr-IN', label: 'मराठी' },
];

const SAMPLE_TRANSCRIPT = `I am Lakshmi, I am 62 years old. I have been cooking traditional South Indian meals for over 40 years. I make idli, dosa, sambar, rasam, and festival sweets like Mysore Pak. I can prepare fresh tiffin boxes daily and also do small catering for functions. I speak Kannada, Tamil and Hindi. I live in Jayanagar.`;

const AI_EXTRACTED: Partial<Provider> & { name: string; age: number } = {
  name: 'Lakshmi',
  age: 62,
  category: 'Cooking' as Category,
  skillTitle: 'Home-style South Indian Meals',
  skills: ['South Indian Cooking', 'Tiffin Preparation', 'Festival Sweets', 'Pickles', 'Small Catering'],
  experienceYears: 40,
  languages: ['Kannada', 'Tamil', 'Hindi'],
  locationArea: 'Jayanagar',
  bio: 'Experienced home cook specialising in traditional South Indian meals and festival sweets. 40 years of serving fresh, authentic food to families and small events.',
};

export function OnboardingScreen() {
  const { navigate, user, setUser, enableLocation } = useApp();
  const [step, setStep] = useState<'lang' | 'voice' | 'analyzing' | 'details'>('lang');
  const [lang, setLang] = useState('en-IN');
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setListening(true);
      let i = 0;
      const interval = setInterval(() => {
        setTranscript(SAMPLE_TRANSCRIPT.slice(0, i));
        i += 8;
        if (i > SAMPLE_TRANSCRIPT.length) { clearInterval(interval); setListening(false); }
      }, 30);
      return;
    }
    const rec = new SR();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    recognitionRef.current = rec;
    rec.onresult = (e: any) => { let text = ''; for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript; setTranscript(text); };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    setListening(true);
  };

  const stopListening = () => { recognitionRef.current?.stop(); setListening(false); };
  useEffect(() => { return () => recognitionRef.current?.stop(); }, []);

  const analyze = () => { setStep('analyzing'); setTimeout(() => setStep('details'), 2600); };

  const finish = async () => {
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number (at least 10 digits).');
      return;
    }
    if (!address.trim()) {
      setError('Please enter your home address so customers can find you nearby.');
      return;
    }
    setError('');
    setSaving(true);

    const updatedUser = {
      ...user,
      name: AI_EXTRACTED.name,
      phone: phone.trim(),
      address: address.trim(),
      onboarded: true,
      profile: AI_EXTRACTED,
    };
    setUser(updatedUser);
    enableLocation();

    if (user?.id) {
      await supabase.from('profiles').update({
        name: AI_EXTRACTED.name,
        phone: phone.trim(),
        address: address.trim(),
        skill_title: AI_EXTRACTED.skillTitle,
        bio: AI_EXTRACTED.bio,
        skills: AI_EXTRACTED.skills,
        languages: AI_EXTRACTED.languages,
        category: AI_EXTRACTED.category,
        experience_years: AI_EXTRACTED.experienceYears,
        location_area: AI_EXTRACTED.locationArea,
        onboarded: true,
      }).eq('id', user.id);
    }

    setSaving(false);
    navigate('home');
  };

  const stepNum = step === 'lang' ? 1 : step === 'details' ? 3 : 2;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="font-bold text-ink-900 text-lg">SilverHands</span>
          </div>
          <span className="text-sm text-ink-400 font-medium">Step {stepNum} of 3</span>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-3xl mx-auto w-full px-6 pt-6">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(n => (
            <div key={n} className={`h-2 rounded-full flex-1 transition-all ${stepNum >= n ? 'bg-brand-500' : 'bg-ink-200'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-8">
        {/* Language */}
        {step === 'lang' && (
          <div className="animate-fade-in">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
              <Globe size={32} className="text-brand-600" />
            </div>
            <h1 className="text-3xl font-bold text-ink-900">Choose your language</h1>
            <p className="text-ink-500 mt-2 text-lg">SilverHands speaks your language. Pick what you are most comfortable with.</p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`p-5 rounded-2xl border-2 text-center transition-all ${lang === l.code ? 'border-brand-500 bg-brand-50' : 'border-ink-200 hover:border-ink-300'}`}
                >
                  <div className={`font-bold text-lg ${lang === l.code ? 'text-brand-600' : 'text-ink-800'}`}>{l.label}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep('voice')} className="mt-8 w-full bg-brand-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-lg">
              Continue <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Voice */}
        {step === 'voice' && (
          <div className="animate-fade-in flex flex-col flex-1">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
              <Mic size={32} className="text-brand-600" />
            </div>
            <h1 className="text-3xl font-bold text-ink-900">Tell us about yourself</h1>
            <p className="text-ink-500 mt-2 leading-relaxed max-w-lg text-lg">
              Just speak naturally. Tell us your name, what you are good at, your experience, and where you live. Our AI will build your profile automatically — no typing needed.
            </p>

            <div className="mt-6 bg-ink-50 rounded-2xl p-5 min-h-[180px] flex-1">
              <div className="flex items-center gap-2 text-sm text-ink-400 mb-2">
                <Volume2 size={18} />
                {listening ? 'Listening...' : transcript ? 'Your response' : 'Tap the mic and start speaking'}
              </div>
              <p className="text-ink-700 text-base leading-relaxed">{transcript || <span className="text-ink-300">Your words will appear here...</span>}</p>
            </div>

            <div className="flex flex-col items-center mt-6">
              <button
                onClick={listening ? stopListening : startListening}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all active:scale-95 ${listening ? 'bg-error-500' : 'bg-brand-500'} text-white shadow-glow`}
              >
                {listening && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-error-500 animate-pulse-ring" />
                    <span className="absolute inset-0 rounded-full bg-error-500 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
                <Mic size={36} className="relative" />
              </button>
              <p className="mt-3 text-base font-medium text-ink-600">{listening ? 'Tap to stop' : 'Tap to speak'}</p>
            </div>

            {transcript && (
              <button onClick={analyze} className="mt-6 w-full bg-brand-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all animate-slide-up text-lg">
                Build my profile with AI <Sparkles size={20} />
              </button>
            )}
          </div>
        )}

        {/* Analyzing */}
        {step === 'analyzing' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div className="relative">
              <div className="w-28 h-28 bg-brand-50 rounded-full flex items-center justify-center">
                <Loader2 size={44} className="text-brand-500 animate-spin" />
              </div>
              <Sparkles size={28} className="absolute -top-1 -right-1 text-accent-500" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900 mt-6">AI is understanding you...</h2>
            <div className="mt-6 space-y-2.5 w-full max-w-sm">
              {['Identifying your skills', 'Estimating experience level', 'Writing your professional bio', 'Generating your profile'].map((t, i) => (
                <div key={t} className="flex items-center gap-3 bg-ink-50 rounded-xl px-4 py-3 animate-slide-up" style={{ animationDelay: `${i * 0.4}s`, opacity: 0, animationFillMode: 'forwards' }}>
                  <div className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-ink-700">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile preview + contact details */}
        {step === 'details' && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                <Check size={26} className="text-success-600" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-ink-900">Your profile is ready!</h1>
                <p className="text-sm text-ink-500">AI generated this from your voice</p>
              </div>
            </div>

            {/* AI-generated profile preview */}
            <div className="bg-white border border-ink-200 rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 font-bold text-2xl">{AI_EXTRACTED.name[0]}</div>
                <div>
                  <h2 className="font-bold text-ink-900 text-xl">{AI_EXTRACTED.name}</h2>
                  <p className="text-sm text-ink-500">{AI_EXTRACTED.age} years • {AI_EXTRACTED.locationArea}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold text-ink-400 uppercase tracking-wide">Skill Title</div>
                <div className="text-ink-800 font-medium mt-1 text-lg">{AI_EXTRACTED.skillTitle}</div>
              </div>

              <div className="mt-3">
                <div className="text-xs font-semibold text-ink-400 uppercase tracking-wide">Bio</div>
                <p className="text-sm text-ink-600 mt-1 leading-relaxed">{AI_EXTRACTED.bio}</p>
              </div>

              <div className="mt-3">
                <div className="text-xs font-semibold text-ink-400 uppercase tracking-wide">Skills identified</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(AI_EXTRACTED.skills ?? []).map(s => (
                    <span key={s} className="bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-ink-50 rounded-xl p-3">
                  <div className="text-xs text-ink-400">Experience</div>
                  <div className="font-bold text-ink-800 text-lg">{AI_EXTRACTED.experienceYears} years</div>
                </div>
                <div className="bg-ink-50 rounded-xl p-3">
                  <div className="text-xs text-ink-400">Languages</div>
                  <div className="font-bold text-ink-800 text-sm">{(AI_EXTRACTED.languages ?? []).join(', ')}</div>
                </div>
              </div>
            </div>

            {/* Contact details form */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-ink-900 mb-1">Your contact details</h2>
              <p className="text-sm text-ink-500 mb-4 flex items-start gap-2">
                <MapPin size={18} className="text-brand-500 shrink-0 mt-0.5" />
                Your phone number and address are private. They are only shared with people after you connect with them.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-ink-600 flex items-center gap-1.5">
                    <Phone size={16} className="text-ink-400" /> Phone number
                  </label>
                  <div className="mt-2 flex items-center gap-2 bg-white border-2 border-ink-200 rounded-xl px-4 py-3.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                    <span className="text-ink-600 font-medium text-lg">+91</span>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      inputMode="tel"
                      type="tel"
                      className="flex-1 bg-transparent outline-none text-lg font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-ink-600 flex items-center gap-1.5">
                    <Home size={16} className="text-ink-400" /> Home address
                  </label>
                  <div className="mt-2 bg-white border-2 border-ink-200 rounded-xl px-4 py-3.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                    <textarea
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Flat / House no, Street, Area, City — e.g. 12, 4th Cross, Jayanagar, Bengaluru"
                      rows={3}
                      className="w-full bg-transparent outline-none text-base resize-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-error-50 border border-error-100 rounded-xl px-4 py-3 text-sm text-error-600 animate-slide-up">
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 bg-brand-50 rounded-2xl p-4 flex items-center gap-3">
              <MapPin size={22} className="text-brand-600 shrink-0" />
              <div className="text-sm text-ink-600">We'll use your location to show you nearby customers and services within 7 km.</div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep('voice')}
                className="px-5 py-4 rounded-xl border-2 border-ink-200 text-ink-600 font-semibold flex items-center gap-2 active:scale-[0.98] transition-all"
              >
                <ChevronLeft size={20} /> Back
              </button>
              <button
                onClick={finish}
                disabled={saving}
                className="flex-1 bg-brand-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-lg disabled:opacity-50"
              >
                {saving ? <><Loader2 size={20} className="animate-spin" /> Saving...</> : <>Start using SilverHands <ChevronRight size={20} /></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
