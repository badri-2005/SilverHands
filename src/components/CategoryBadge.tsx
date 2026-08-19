import type { LucideIcon } from 'lucide-react';
import { getCategoryIcon } from '../utils';
import type { Category } from '../types';

interface Props {
  category: Category;
  size?: number;
  className?: string;
  active?: boolean;
}

export function CategoryBadge({ category, size = 40, className = '', active = false }: Props) {
  const Icon = getCategoryIcon(category);
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl transition-all ${className}`}
      style={{ width: size, height: size }}
    >
      <Icon
        size={size * 0.5}
        className={active ? 'text-brand-600' : 'text-brand-500'}
        strokeWidth={2}
      />
    </div>
  );
}

export function CategoryPill({ category, active, onClick }: { category: Category; active?: boolean; onClick?: () => void }) {
  const Icon: LucideIcon = getCategoryIcon(category);
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-all ${
        active
          ? 'bg-brand-500 text-white shadow-soft'
          : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
      }`}
    >
      <Icon size={15} strokeWidth={2.2} />
      {category}
    </button>
  );
}
