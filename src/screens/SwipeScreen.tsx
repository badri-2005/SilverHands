import { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { PROVIDERS } from '../mockData';
import { CategoryBadge } from '../components/CategoryBadge';
import { Star, MapPin, BadgeCheck, X, Heart, Check, RotateCcw, Zap, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { formatPrice, formatDistance } from '../utils';

export function SwipeScreen() {
  const { navigate, setSelectedProvider } = useApp();
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });
  const [action, setAction] = useState<'left' | 'right' | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [showMatch, setShowMatch] = useState<string | null>(null);
  const startRef = useRef({ x: 0, y: 0 });

  const deck = [...PROVIDERS].sort((a, b) => b.matchScore - a.matchScore);
  const current = deck[index];
  const next = deck[index + 1];

  if (index >= deck.length) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={40} className="text-success-600" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-bold text-ink-900">You've seen everyone nearby!</h2>
        <p className="text-ink-500 mt-2">You matched with {matches.length} people. Check your messages to continue chatting.</p>
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => navigate('messages')} className="bg-brand-500 text-white font-semibold px-6 py-3.5 rounded-xl active:scale-95 transition-transform">
            Go to Messages
          </button>
          <button onClick={() => { setIndex(0); setMatches([]); }} className="text-brand-600 font-medium flex items-center gap-1.5 px-4 py-3.5">
            <RotateCcw size={16} /> Start over
          </button>
        </div>
      </div>
    );
  }

  const onPointerDown = (e: React.PointerEvent) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, dragging: true });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.dragging) return;
    setDrag({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y, dragging: true });
  };

  const onPointerUp = () => {
    if (!drag.dragging) return;
    const threshold = 100;
    if (drag.x > threshold) return swipe('right');
    if (drag.x < -threshold) return swipe('left');
    setDrag({ x: 0, y: 0, dragging: false });
  };

  const swipe = (dir: 'left' | 'right') => {
    setAction(dir);
    setDrag({ x: dir === 'right' ? 500 : -500, y: 0, dragging: false });
    if (dir === 'right') {
      setMatches(prev => [...prev, current.id]);
      if (current.matchScore >= 88) {
        setTimeout(() => setShowMatch(current.id), 200);
      }
    }
    setTimeout(() => {
      setIndex(i => i + 1);
      setAction(null);
      setDrag({ x: 0, y: 0, dragging: false });
    }, 250);
  };

  const openProfile = () => {
    setSelectedProvider(current);
    navigate('profileView', { id: current.id });
  };

  const rotation = drag.x * 0.06;
  const opacity = Math.min(1, Math.abs(drag.x) / 100);

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-ink-900 flex items-center justify-center gap-2">
          <Sparkles size={24} className="text-brand-500" /> SilverSwipe
        </h1>
        <p className="text-ink-500 mt-1">Swipe right if interested, left to pass. Tap the card to view the full profile.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Card area */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-md" style={{ height: 560 }}>
            {/* Next card */}
            {next && (
              <div className="absolute inset-0 scale-95 opacity-50">
                <SwipeCard provider={next} />
              </div>
            )}

            {/* Current card */}
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onClick={openProfile}
              className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
              style={{
                transform: `translate(${drag.x}px, ${drag.y / 8}px) rotate(${rotation}deg)`,
                transition: drag.dragging ? 'none' : 'transform 0.25s ease-out',
              }}
            >
              <SwipeCard provider={current} />
              {action === 'right' && (
                <div className="absolute inset-0 rounded-3xl border-4 border-success-500 flex items-center justify-center bg-success-500/10">
                  <div className="bg-success-500 text-white px-5 py-2 rounded-full font-bold text-lg rotate-[-12deg] flex items-center gap-2">
                    <Heart size={22} fill="currentColor" /> INTERESTED
                  </div>
                </div>
              )}
              {action === 'left' && (
                <div className="absolute inset-0 rounded-3xl border-4 border-ink-400 flex items-center justify-center bg-ink-500/10">
                  <div className="bg-ink-500 text-white px-5 py-2 rounded-full font-bold text-lg rotate-12 flex items-center gap-2">
                    <X size={22} /> PASS
                  </div>
                </div>
              )}
              {drag.dragging && !action && (
                <>
                  {drag.x > 40 && (
                    <div className="absolute top-6 left-6 bg-success-500 text-white px-4 py-2 rounded-full font-bold rotate-[-12deg] flex items-center gap-2" style={{ opacity }}>
                      <Heart size={20} fill="currentColor" /> LIKE
                    </div>
                  )}
                  {drag.x < -40 && (
                    <div className="absolute top-6 right-6 bg-ink-500 text-white px-4 py-2 rounded-full font-bold rotate-12 flex items-center gap-2" style={{ opacity }}>
                      <X size={20} /> NOPE
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-5 mt-8">
            <button
              onClick={() => swipe('left')}
              className="w-16 h-16 bg-white border-2 border-ink-200 rounded-full flex items-center justify-center shadow-card hover:border-ink-300 active:scale-90 transition-all"
              aria-label="Pass"
            >
              <X size={28} className="text-ink-500" />
            </button>
            <button
              onClick={openProfile}
              className="w-14 h-14 bg-white border-2 border-brand-200 rounded-full flex items-center justify-center shadow-card hover:border-brand-400 active:scale-90 transition-all"
              aria-label="View profile"
            >
              <span className="text-sm font-bold text-brand-600">View</span>
            </button>
            <button
              onClick={() => swipe('right')}
              className="w-16 h-16 bg-white border-2 border-success-500 rounded-full flex items-center justify-center shadow-card hover:bg-success-50 active:scale-90 transition-all"
              aria-label="Interested"
            >
              <Heart size={28} className="text-success-500" />
            </button>
          </div>

          <p className="text-sm text-ink-400 mt-4">{deck.length - index} cards remaining</p>
        </div>

        {/* Sidebar — matches & tips */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 font-semibold mb-1">
              <Heart size={18} fill="currentColor" /> {matches.length} Matches
            </div>
            <p className="text-sm text-white/80">People you've liked will appear here. When they like you back, it's a match!</p>
          </div>

          <div className="bg-white border border-ink-100 rounded-2xl p-5">
            <h3 className="font-semibold text-ink-900 mb-3">How it works</h3>
            <div className="space-y-3 text-sm text-ink-600">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-error-50 rounded-lg flex items-center justify-center shrink-0"><ArrowLeft size={16} className="text-error-500" /></div>
                <span>Swipe left or tap the X to pass on a profile.</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-success-50 rounded-lg flex items-center justify-center shrink-0"><ArrowRight size={16} className="text-success-500" /></div>
                <span>Swipe right or tap the heart to show interest.</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-brand-50 rounded-lg flex items-center justify-center shrink-0"><Zap size={16} className="text-brand-500" /></div>
                <span>High match scores may trigger an instant match celebration.</span>
              </div>
            </div>
          </div>

          {matches.length > 0 && (
            <div className="bg-white border border-ink-100 rounded-2xl p-5">
              <h3 className="font-semibold text-ink-900 mb-3">Your matches</h3>
              <div className="space-y-2">
                {matches.map(id => {
                  const p = PROVIDERS.find(x => x.id === id);
                  if (!p) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => { setSelectedProvider(p); navigate('profileView', { id: p.id }); }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-ink-50 transition-colors text-left"
                    >
                      <img src={p.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-ink-800 truncate">{p.name}</div>
                        <div className="text-xs text-ink-400">{p.skillTitle}</div>
                      </div>
                      <Zap size={14} className="text-brand-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showMatch && (
        <MatchModal
          providerId={showMatch}
          onClose={() => setShowMatch(null)}
          onMessage={() => {
            const p = PROVIDERS.find(x => x.id === showMatch);
            setShowMatch(null);
            if (p) {
              setSelectedProvider(p);
              navigate('chat', { providerId: p.id });
            }
          }}
        />
      )}
    </div>
  );
}

function SwipeCard({ provider }: { provider: typeof PROVIDERS[number] }) {
  return (
    <div className="w-full h-full bg-white rounded-3xl shadow-soft border border-ink-100 overflow-hidden flex flex-col">
      <div className="relative h-72 shrink-0">
        <img src={provider.avatar} alt={provider.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <Zap size={14} className="text-brand-500" />
          <span className="text-sm font-bold text-brand-600">{provider.matchScore}% Match</span>
        </div>
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <div className="flex items-center gap-1.5">
            <h2 className="text-2xl font-bold">{provider.name}</h2>
            {provider.verified && <BadgeCheck size={20} className="text-brand-300" fill="currentColor" stroke="white" />}
          </div>
          <p className="text-sm text-white/90">{provider.skillTitle}</p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Star size={15} className="fill-warning-500 text-warning-500" />
            <span className="font-semibold text-ink-800">{provider.rating}</span>
            <span className="text-ink-400">({provider.reviews})</span>
          </span>
          <span className="flex items-center gap-1 text-ink-600">
            <MapPin size={15} className="text-brand-500" />
            {formatDistance(provider.distanceKm)}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <CategoryBadge category={provider.category} size={28} />
          <span className="text-sm font-medium text-ink-600">{provider.category}</span>
          <span className="ml-auto font-bold text-brand-600">from {formatPrice(provider.priceFrom)}</span>
        </div>

        <p className="text-sm text-ink-600 mt-3 leading-relaxed line-clamp-3">{provider.bio}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {provider.skills.slice(0, 4).map(s => (
            <span key={s} className="bg-ink-100 text-ink-600 text-xs font-medium px-2.5 py-1 rounded-full">{s}</span>
          ))}
        </div>

        <div className="mt-3 text-xs text-ink-400">
          <span className="font-medium">Available:</span> {provider.availability}
        </div>
      </div>
    </div>
  );
}

function MatchModal({ providerId, onClose, onMessage }: { providerId: string; onClose: () => void; onMessage: () => void }) {
  const provider = PROVIDERS.find(p => p.id === providerId)!;
  return (
    <div className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center px-6 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="text-2xl font-bold text-brand-600 mb-1">It's a Match!</div>
        <p className="text-ink-500 text-sm mb-6">{provider.name} might be a great fit for you</p>
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={provider.avatar} alt={provider.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-brand-200" />
          <div className="text-3xl">🤝</div>
          <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-2xl border-4 border-brand-200">
            You
          </div>
        </div>
        <div className="bg-brand-50 rounded-2xl p-3 mb-6">
          <div className="font-semibold text-ink-800">{provider.matchScore}% Match</div>
          <div className="text-xs text-ink-500">{provider.skillTitle} • {formatDistance(provider.distanceKm)} away</div>
        </div>
        <button onClick={onMessage} className="w-full bg-brand-500 text-white font-semibold py-3.5 rounded-2xl active:scale-95 transition-transform">
          Send a message
        </button>
        <button onClick={onClose} className="mt-2 w-full text-ink-500 font-medium py-2">Keep swiping</button>
      </div>
    </div>
  );
}
