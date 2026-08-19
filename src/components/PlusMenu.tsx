import { useApp } from '../AppContext';
import { Scissors, ShoppingBag, Search, X, ArrowRight } from 'lucide-react';

export function PlusMenu({ onClose }: { onClose: () => void }) {
  const { navigate, user } = useApp();

  const handle = (screen: 'listing' | 'products' | 'search') => {
    onClose();
    if (!user) navigate('auth');
    else navigate(screen);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 backdrop-blur-md animate-fade-in px-4" onClick={onClose}>
      <div className="w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white animate-slide-right">What would you like to do?</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <MenuItem
            icon={Scissors}
            title="Offer a Service"
            subtitle="List your skills for others to book"
            color="from-brand-500 to-brand-600"
            onClick={() => handle('listing')}
            delay={0.05}
          />
          <MenuItem
            icon={ShoppingBag}
            title="Sell a Product"
            subtitle="Sell homemade goods to nearby buyers"
            color="from-accent-500 to-accent-600"
            onClick={() => handle('products')}
            delay={0.12}
          />
          <MenuItem
            icon={Search}
            title="Find Customers"
            subtitle="Get matched with people near you"
            color="from-success-500 to-success-600"
            onClick={() => handle('search')}
            delay={0.19}
          />
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  title,
  subtitle,
  color,
  onClick,
  delay,
}: {
  icon: typeof Scissors;
  title: string;
  subtitle: string;
  color: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl p-4 flex items-center gap-4 shadow-soft active:scale-[0.98] transition-all text-left hover:shadow-glow animate-slide-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
        <Icon size={24} strokeWidth={2.2} />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-ink-900">{title}</div>
        <div className="text-sm text-ink-500">{subtitle}</div>
      </div>
      <ArrowRight size={20} className="text-ink-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
    </button>
  );
}
