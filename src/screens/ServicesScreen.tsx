import { useState } from 'react';
import { useApp } from '../AppContext';
import { PROVIDERS } from '../mockData';
import { ProviderCard } from '../components/ProviderCard';
import { Flame, ArrowRight } from 'lucide-react';

export function ServicesScreen() {
  const { navigate, setSelectedProvider } = useApp();

  const openProvider = (id: string) => {
    const p = PROVIDERS.find(x => x.id === id);
    if (p) {
      setSelectedProvider(p);
      navigate('profileView', { id });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-ink-900">Services Marketplace</h1>
      </div>
      <p className="text-ink-500 mb-6">Browse and book trusted services from skilled people near you.</p>

      {/* SilverSwipe banner */}
      <div className="bg-gradient-to-r from-ink-800 to-ink-900 rounded-2xl p-5 flex items-center justify-between mb-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
            <Flame size={24} />
          </div>
          <div>
            <div className="font-semibold">Prefer swiping?</div>
            <div className="text-sm text-white/70">Discover services Tinder-style with SilverSwipe</div>
          </div>
        </div>
        <button onClick={() => navigate('swipe')} className="bg-white text-ink-900 font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap">
          Open Swipe <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROVIDERS.map(p => (
          <ProviderCard key={p.id} provider={p} onClick={() => openProvider(p.id)} />
        ))}
      </div>
    </div>
  );
}
