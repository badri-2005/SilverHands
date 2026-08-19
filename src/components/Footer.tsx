import { useApp } from '../AppContext';
import { Sparkles, MapPin, Mail, Phone, Heart } from 'lucide-react';
import type { Screen } from '../types';

export function Footer() {
  const { navigate } = useApp();

  const links: { label: string; screen: Screen }[] = [
    { label: 'Home', screen: 'home' },
    { label: 'Discover', screen: 'discover' },
    { label: 'Services', screen: 'services' },
    { label: 'Products', screen: 'products' },
    { label: 'SilverSwipe', screen: 'swipe' },
    { label: 'Dashboard', screen: 'dashboard' },
  ];

  return (
    <footer className="bg-ink-900 text-ink-300">
      <div className="px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white">SilverHands</span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            AI-powered hyperlocal livelihood platform for senior citizens and homemakers in India. Turn your skills, experience, and traditional knowledge into income.
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-ink-400">
            <MapPin size={16} className="text-brand-400" /> Bengaluru, India
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm">Explore</h4>
          <div className="flex flex-col gap-2">
            {links.map(l => (
              <button key={l.label} onClick={() => navigate(l.screen)} className="text-sm text-left hover:text-brand-400 transition-colors">
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm">Contact</h4>
          <div className="flex flex-col gap-2 text-sm">
            <span className="flex items-center gap-2"><Mail size={16} className="text-brand-400" /> hello@silverhands.in</span>
            <span className="flex items-center gap-2"><Phone size={16} className="text-brand-400" /> +91 80 4567 8900</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 px-8 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-6xl">
        <p className="text-xs text-ink-500 flex items-center gap-1">© 2026 SilverHands. Made with <Heart size={12} className="text-error-500 fill-error-500" /> for every hand.</p>
        <div className="flex gap-4 text-xs text-ink-500">
          <button className="hover:text-ink-300 transition-colors">Privacy</button>
          <button className="hover:text-ink-300 transition-colors">Terms</button>
          <button className="hover:text-ink-300 transition-colors">Safety</button>
        </div>
      </div>
    </footer>
  );
}
