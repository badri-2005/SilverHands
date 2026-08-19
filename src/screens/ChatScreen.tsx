import { useState, useRef, useEffect } from 'react';
import { useApp, getProvider } from '../AppContext';
import { CategoryBadge } from '../components/CategoryBadge';
import { Send, Mic, Calendar, Phone, BadgeCheck, StopCircle, Play } from 'lucide-react';

export function ChatScreen() {
  const { currentThreadId, threads, sendMessage, params, navigate } = useApp();
  const providerId = params.providerId;
  const provider = providerId ? getProvider(providerId) : undefined;
  const thread = threads.find(t => t.id === currentThreadId);
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [thread?.messages.length]);

  if (!provider) {
    return <div className="max-w-2xl mx-auto px-6 py-16 text-center text-ink-400">Chat not found</div>;
  }

  const send = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText('');
  };

  const sendVoice = () => {
    sendMessage('Voice message', true);
    setRecording(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-6">
      <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden flex flex-col animate-scale-in" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-ink-100">
          <img src={provider.avatar} alt={provider.name} className="w-11 h-11 rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h1 className="font-semibold text-ink-900 truncate">{provider.name}</h1>
              {provider.verified && <BadgeCheck size={15} className="text-brand-500 shrink-0" fill="currentColor" stroke="white" />}
            </div>
            <p className="text-xs text-success-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-success-500 rounded-full" /> Online • {provider.skillTitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <CategoryBadge category={provider.category} size={32} />
            </div>
            <button className="p-2.5 rounded-full hover:bg-ink-100 transition-colors"><Phone size={20} className="text-brand-600" /></button>
            <button onClick={() => setShowBooking(true)} className="bg-brand-50 text-brand-600 font-medium text-sm px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-brand-100 transition-colors">
              <Calendar size={16} /> <span className="hidden sm:block">Book</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-ink-50">
          <div className="text-center">
            <span className="bg-ink-200 text-ink-500 text-xs px-3 py-1 rounded-full">Today</span>
          </div>

          {thread?.messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.fromMe ? 'bg-brand-500 text-white rounded-br-md' : 'bg-white text-ink-800 rounded-bl-md shadow-card'}`}>
                {msg.voice ? (
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <button className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.fromMe ? 'bg-white/20' : 'bg-brand-100'}`}>
                      <Play size={16} className={msg.fromMe ? 'text-white' : 'text-brand-600'} fill="currentColor" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-end gap-0.5 h-6">
                        {[8, 14, 20, 12, 18, 24, 10, 16, 22, 8, 14, 6].map((h, i) => (
                          <div key={i} className={`w-1 rounded-full ${msg.fromMe ? 'bg-white/70' : 'bg-brand-400'}`} style={{ height: h }} />
                        ))}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${msg.fromMe ? 'text-white/70' : 'text-ink-400'}`}>{msg.duration}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                )}
                <div className={`text-[10px] mt-1 ${msg.fromMe ? 'text-white/60' : 'text-ink-400'}`}>{msg.time}</div>
              </div>
            </div>
          ))}

          {(!thread || thread.messages.length === 0) && (
            <div className="text-center py-10 text-ink-400 text-sm">Say hello to {provider.name}!</div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-ink-100 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={recording ? sendVoice : () => setRecording(true)}
              className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${recording ? 'bg-error-500 text-white' : 'bg-brand-50 text-brand-600'}`}
            >
              {recording ? <StopCircle size={24} /> : <Mic size={22} />}
            </button>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={recording ? 'Recording... tap stop to send' : 'Type a message...'}
              disabled={recording}
              className="flex-1 bg-ink-50 border border-ink-200 rounded-full px-4 py-3 outline-none focus:border-brand-400 text-sm"
            />
            <button
              onClick={send}
              disabled={!text.trim()}
              className="w-11 h-11 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 disabled:opacity-40 active:scale-90 transition-transform"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {showBooking && (
        <div className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center px-6" onClick={() => setShowBooking(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1.5 bg-ink-200 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-bold text-ink-900">Quick booking</h2>
            <p className="text-sm text-ink-500 mt-1">{provider.skillTitle} with {provider.name}</p>
            <div className="mt-4 space-y-3">
              <div className="bg-ink-50 rounded-xl p-3">
                <div className="text-xs text-ink-400">Suggested time</div>
                <div className="font-medium text-ink-800">{provider.availability.split(',')[0]}</div>
              </div>
              <div className="bg-brand-50 rounded-xl p-3">
                <div className="text-xs text-brand-600">Starting price</div>
                <div className="font-bold text-brand-600">from ₹{provider.priceFrom}</div>
              </div>
            </div>
            <button onClick={() => { setShowBooking(false); navigate('profileView', { id: provider.id }); }} className="mt-5 w-full bg-brand-500 text-white font-semibold py-3.5 rounded-2xl active:scale-95 transition-transform">
              View profile to book
            </button>
            <button onClick={() => setShowBooking(false)} className="mt-2 w-full text-ink-500 font-medium py-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
