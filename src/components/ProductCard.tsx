import { Star, MapPin, Heart } from 'lucide-react';
import type { Product } from '../types';
import { useApp } from '../AppContext';
import { formatPrice, formatDistance } from '../utils';

export function ProductCard({ product, onClick }: { product: Product; onClick?: () => void }) {
  const { savedProviders, toggleSave } = useApp();
  const saved = savedProviders.includes(product.id);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-card border border-ink-100 overflow-hidden cursor-pointer hover:shadow-soft transition-all active:scale-[0.99]"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-100">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
        <button
          onClick={(e) => { e.stopPropagation(); toggleSave(product.id); }}
          className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm"
          aria-label={saved ? 'Unsave' : 'Save'}
        >
          <Heart size={16} className={saved ? 'fill-error-500 text-error-500' : 'text-ink-600'} />
        </button>
        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur text-xs font-semibold text-ink-700 px-2.5 py-1 rounded-full">
          {product.category}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-ink-900 line-clamp-1">{product.title}</h3>
        <p className="text-xs text-ink-400 mt-0.5">by {product.sellerName}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-ink-500">
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-warning-500 text-warning-500" />
            <span className="font-semibold text-ink-700">{product.rating}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-brand-500" />
            {formatDistance(product.distanceKm)}
          </span>
        </div>
        <div className="mt-2 font-bold text-brand-600">{formatPrice(product.price)}</div>
      </div>
    </div>
  );
}
