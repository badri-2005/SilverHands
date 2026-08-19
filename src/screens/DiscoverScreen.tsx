import { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { PROVIDERS, CATEGORIES } from '../mockData';
import { ProviderCard } from '../components/ProviderCard';
import { CategoryPill } from '../components/CategoryBadge';
import { SlidersHorizontal, Flame, MapPin, Navigation, Search, X } from 'lucide-react';
import type { Category } from '../types';

export function DiscoverScreen() {
  const { navigate, params, setSelectedProvider, radius, setRadius, locationEnabled, enableLocation } = useApp();
  const [activeCat, setActiveCat] = useState<Category | 'All'>((params.category as Category) || 'All');
  const [sort, setSort] = useState<'match' | 'distance' | 'rating' | 'price'>('match');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = [...PROVIDERS];
    if (activeCat !== 'All') list = list.filter(p => p.category === activeCat);
    list = list.filter(p => p.distanceKm <= radius);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.skillTitle.toLowerCase().includes(q) ||
        p.skills.some(s => s.toLowerCase().includes(q)) ||
        p.locationArea.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sort === 'distance') return a.distanceKm - b.distanceKm;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'price') return a.priceFrom - b.priceFrom;
      return b.matchScore - a.matchScore;
    });
    return list;
  }, [activeCat, radius, sort, search]);

  const openProvider = (id: string) => {
    const p = PROVIDERS.find(x => x.id === id);
    if (p) {
      setSelectedProvider(p);
      navigate('profileView', { id });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Discover</h1>
            <p className="text-sm text-ink-500 mt-1">Find skilled people near you</p>
          </div>

          {/* Location */}
          <div className="bg-ink-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-brand-600" />
              <span className="font-semibold text-sm text-ink-800">Location</span>
            </div>
            {!locationEnabled ? (
              <button
                onClick={enableLocation}
                className="w-full bg-brand-500 text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Navigation size={15} /> Enable location
              </button>
            ) : (
              <div className="text-sm text-ink-600">Jayanagar, Bengaluru</div>
            )}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-ink-500">Radius</span>
                <span className="font-semibold text-brand-600">{radius} km</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                value={radius}
                onChange={e => setRadius(Number(e.target.value))}
                className="w-full accent-brand-500 h-2"
              />
            </div>
          </div>

          {/* Categories sidebar */}
          <div>
            <h3 className="font-semibold text-sm text-ink-800 mb-3">Categories</h3>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveCat('All')}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCat === 'All' ? 'bg-brand-50 text-brand-600' : 'text-ink-600 hover:bg-ink-50'}`}
              >
                All categories
              </button>
              {CATEGORIES.map(c => (
                <button
                  key={c.name}
                  onClick={() => setActiveCat(c.name)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCat === c.name ? 'bg-brand-50 text-brand-600' : 'text-ink-600 hover:bg-ink-50'}`}
                >
                  {c.emoji} {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* SilverSwipe promo */}
          <button
            onClick={() => navigate('swipe')}
            className="w-full bg-gradient-to-r from-ink-800 to-ink-900 rounded-2xl p-4 text-white text-left hover:shadow-soft transition-shadow"
          >
            <div className="flex items-center gap-2 text-sm font-semibold mb-1">
              <Flame size={16} /> SilverSwipe
            </div>
            <p className="text-xs text-white/70">Swipe to discover local services faster</p>
          </button>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search + sort bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1 flex items-center gap-2 bg-white border border-ink-200 rounded-xl px-4 py-2.5 focus-within:border-brand-400 transition-all">
              <Search size={18} className="text-ink-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, skill, or area..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              {search && <button onClick={() => setSearch('')}><X size={16} className="text-ink-400" /></button>}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <span className="flex items-center gap-1 text-sm text-ink-400 shrink-0"><SlidersHorizontal size={15} /> Sort:</span>
              {([
                ['match', 'Best Match'],
                ['distance', 'Nearest'],
                ['rating', 'Top Rated'],
                ['price', 'Lowest Price'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  className={`text-sm font-medium px-3 py-2 rounded-xl whitespace-nowrap transition-colors ${sort === key ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category pills (horizontal) */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
            <CategoryPill category={'All' as Category} active={activeCat === 'All'} onClick={() => setActiveCat('All')} />
            {CATEGORIES.map(c => (
              <CategoryPill key={c.name} category={c.name} active={activeCat === c.name} onClick={() => setActiveCat(c.name)} />
            ))}
          </div>

          {/* Results */}
          <div className="text-sm text-ink-500 mb-4">{filtered.length} {filtered.length === 1 ? 'person' : 'people'} found within {radius} km</div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(p => (
              <ProviderCard key={p.id} provider={p} onClick={() => openProvider(p.id)} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-ink-400">
              <p className="text-lg">No one found in this area.</p>
              <p className="text-sm mt-1">Try increasing your radius or changing filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
