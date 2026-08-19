import { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { PROVIDERS } from '../mockData';
import { ProviderCard } from '../components/ProviderCard';
import { Mic, Sparkles, Search, X, Loader2, Lightbulb } from 'lucide-react';

const SUGGESTIONS = [
  'Find a mathematics teacher within 5 km for Saturday evening',
  'I need someone to cook South Indian meals daily',
  'Looking for a tailor for blouse stitching nearby',
  'Need a babysitter for tomorrow morning',
  'Find Carnatic music classes for my child',
];

export function SearchScreen() {
  const { navigate, setSelectedProvider } = useApp();
  const [query, setQuery] = useState('');
  const [listening, setListening] = useState(false);
  const [results, setResults] = useState<typeof PROVIDERS | null>(null);
  const [searching, setSearching] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const recognitionRef = useRef<any>(null);

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setQuery('Find a mathematics teacher within 5 km for Saturday evening'); return; }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = true;
    recognitionRef.current = rec;
    rec.onresult = (e: any) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setQuery(text);
    };
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
  };

  const stopVoice = () => { recognitionRef.current?.stop(); setListening(false); };

  const runSearch = (q: string) => {
    setQuery(q);
    setSearching(true);
    setResults(null);
    setTimeout(() => {
      const lower = q.toLowerCase();
      let scored = PROVIDERS.map(p => {
        let score = 0;
        if (lower.includes('math') && p.category === 'Teaching') score += 30;
        if (lower.includes('cook') || lower.includes('tiffin') || lower.includes('meal')) { if (p.category === 'Cooking') score += 30; }
        if (lower.includes('tailor') || lower.includes('blouse') || lower.includes('stitch')) { if (p.category === 'Tailoring') score += 30; }
        if (lower.includes('babysit') || lower.includes('child') || lower.includes('nanny')) { if (p.category === 'Childcare') score += 30; }
        if (lower.includes('music')) { if (p.category === 'Music') score += 30; }
        if (lower.includes('garden')) { if (p.category === 'Gardening') score += 30; }
        if (lower.includes('repair') || lower.includes('electric')) { if (p.category === 'Repairs') score += 30; }
        if (lower.includes('craft') || lower.includes('handmade')) { if (p.category === 'Handicrafts') score += 30; }

        const kmMatch = lower.match(/(\d+)\s*km/);
        const maxKm = kmMatch ? parseInt(kmMatch[1]) : 7;
        if (p.distanceKm <= maxKm) score += 20; else score -= 10;

        if (lower.includes('saturday') || lower.includes('evening') || lower.includes('weekend')) {
          if (p.availability.toLowerCase().includes('sat') || p.availability.toLowerCase().includes('daily')) score += 10;
        }
        score += Math.round((p.rating - 4) * 10);
        return { ...p, matchScore: Math.min(99, Math.max(50, score + 60)) };
      });
      scored = scored.filter(p => (p as any).matchScore > 55).sort((a, b) => (b as any).matchScore - (a as any).matchScore);

      setResults(scored as typeof PROVIDERS);
      setAiSummary(
        scored.length > 0
          ? `I found ${scored.length} ${scored.length === 1 ? 'person' : 'people'} matching your request. ${scored[0].name} is the best fit — ${(scored[0] as any).matchScore}% match, ${scored[0].distanceKm} km away, available ${scored[0].availability}.`
          : 'I could not find an exact match nearby. Try broadening your search area or requirements.'
      );
      setSearching(false);
    }, 1400);
  };

  const openProvider = (id: string) => {
    const p = PROVIDERS.find(x => x.id === id);
    if (p) { setSelectedProvider(p); navigate('profileView', { id }); }
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2 animate-slide-right"><Sparkles size={24} className="text-brand-500" /> AI Search</h1>
      <p className="text-ink-500 mt-1 mb-6">Search in your own words or with your voice. Our AI understands natural language.</p>

      {/* Search bar */}
      <div className="bg-white border border-ink-200 rounded-2xl flex items-center gap-2 px-4 py-3.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all shadow-card">
        <Search size={22} className="text-ink-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && query.trim() && runSearch(query)}
          placeholder="Ask in your own words... e.g. 'Find a maths tutor within 5 km for Saturday'"
          className="flex-1 bg-transparent outline-none text-base"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults(null); setAiSummary(''); }} className="text-ink-400"><X size={18} /></button>
        )}
        <button
          onClick={listening ? stopVoice : startVoice}
          className={`p-2 rounded-full transition-colors ${listening ? 'bg-error-500 text-white' : 'text-brand-600 bg-brand-50'}`}
        >
          <Mic size={20} className={listening ? 'animate-pulse' : ''} />
        </button>
        <button
          onClick={() => query.trim() && runSearch(query)}
          className="bg-brand-500 text-white font-semibold px-4 py-2 rounded-xl text-sm active:scale-95 transition-transform"
        >
          Search
        </button>
      </div>

      {/* Suggestions */}
      {!results && !searching && (
        <div className="mt-8 animate-fade-in">
          <div className="flex items-center gap-2 text-sm font-medium text-ink-600 mb-3">
            <Lightbulb size={16} className="text-accent-500" /> Try asking
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => runSearch(s)}
                className="text-left bg-white border border-ink-200 rounded-2xl p-4 text-sm text-ink-700 hover:border-brand-300 hover:bg-brand-50/50 transition-all active:scale-[0.99]"
              >
                "{s}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Searching */}
      {searching && (
        <div className="mt-12 flex flex-col items-center animate-fade-in">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center">
            <Loader2 size={28} className="text-brand-500 animate-spin" />
          </div>
          <p className="mt-4 text-sm text-ink-500">AI is understanding your request...</p>
        </div>
      )}

      {/* Results */}
      {results && !searching && (
        <div className="mt-6 animate-fade-in">
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 text-sm font-medium mb-1.5">
              <Sparkles size={16} /> AI Answer
            </div>
            <p className="leading-relaxed">{aiSummary}</p>
          </div>

          <div className="text-sm text-ink-500 mt-5 mb-3">{results.length} results found</div>
          <div className="grid sm:grid-cols-2 gap-4">
            {results.map(p => (
              <ProviderCard key={p.id} provider={p as any} onClick={() => openProvider(p.id)} />
            ))}
            {results.length === 0 && (
              <div className="col-span-2 text-center py-10 text-ink-400">No matches found. Try a different search.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
