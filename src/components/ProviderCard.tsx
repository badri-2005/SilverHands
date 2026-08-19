import { Star, MapPin, BadgeCheck, Heart } from 'lucide-react';
import type { Provider } from '../types';
import { useApp } from '../AppContext';
import { formatPrice, formatDistance } from '../utils';
import { CategoryBadge } from './CategoryBadge';

export function ProviderCard({ provider, onClick }: { provider: Provider; onClick?: () => void }) {
  const { savedProviders, toggleSave } = useApp();
  const saved = savedProviders.includes(provider.id);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-card border border-ink-100 p-3.5 flex gap-3.5 cursor-pointer hover:shadow-soft transition-all active:scale-[0.99]"
    >
      <div className="relative shrink-0">
        <img src={provider.avatar} alt={provider.name} className="w-16 h-16 rounded-2xl object-cover" loading="lazy" />
        <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-xl shadow-sm border border-ink-100">
          <CategoryBadge category={provider.category} size={26} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-ink-900 truncate">{provider.name}</h3>
              {provider.verified && <BadgeCheck size={15} className="text-brand-500 shrink-0" fill="currentColor" stroke="white" strokeWidth={2} />}
            </div>
            <p className="text-sm text-ink-500 truncate">{provider.skillTitle}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); toggleSave(provider.id); }}
            className="shrink-0 -mt-1 -mr-1 p-2 rounded-full hover:bg-ink-100 transition-colors"
            aria-label={saved ? 'Unsave' : 'Save'}
          >
            <Heart size={18} className={saved ? 'fill-error-500 text-error-500' : 'text-ink-400'} />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-2 text-xs text-ink-500">
          <span className="flex items-center gap-1">
            <Star size={13} className="fill-warning-500 text-warning-500" />
            <span className="font-semibold text-ink-700">{provider.rating}</span>
            <span>({provider.reviews})</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-brand-500" />
            {formatDistance(provider.distanceKm)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <span className="text-xs text-ink-400">{provider.locationArea}</span>
          <span className="text-sm font-bold text-brand-600">from {formatPrice(provider.priceFrom)}</span>
        </div>
      </div>
    </div>
  );
}
