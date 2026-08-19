import { useApp } from '../AppContext';
import {
  Sparkles, Home, Compass, Scissors, ShoppingBag, Flame,
  LayoutDashboard, Search, MessageCircle, User, Plus,
  MapPin, Mic, X, LogIn,
} from 'lucide-react';
import { useState } from 'react';
import { PlusMenu } from './PlusMenu';
import type { Screen } from '../types';

interface NavItem {
  label: string;
  screen: Screen;
  icon: typeof Home;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', screen: 'home', icon: Home },
  { label: 'Discover', screen: 'discover', icon: Compass },
  { label: 'Services', screen: 'services', icon: Scissors },
  { label: 'Products', screen: 'products', icon: ShoppingBag },
  { label: 'SilverSwipe', screen: 'swipe', icon: Flame },
  { label: 'Dashboard', screen: 'dashboard', icon: LayoutDashboard },
  { label: 'Messages', screen: 'messages', icon: MessageCircle },
  { label: 'Profile', screen: 'profile', icon: User },
];

export function Sidebar() {
  const { screen, navigate, user, threads, locationEnabled } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalUnread = threads.reduce((s, t) => s + t.unread, 0);

  const handleNav = (s: Screen) => {
    navigate(s);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <button
        onClick={() => handleNav('home')}
        className="flex items-center gap-2.5 px-5 h-16 shrink-0 group"
      >
        <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform">
          <Sparkles size={20} className="text-white" />
        </div>
        <span className="font-bold text-lg text-white">SilverHands</span>
      </button>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 sidebar-scroll overflow-y-auto">
        {NAV_ITEMS.map((item, i) => {
          const isActive = screen === item.screen;
          const badge = item.screen === 'messages' ? totalUnread : 0;
          return (
            <button
              key={item.screen}
              onClick={() => handleNav(item.screen)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group animate-slide-in-left ${
                isActive
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-ink-300 hover:bg-white/10 hover:text-white'
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <item.icon
                size={19}
                strokeWidth={isActive ? 2.4 : 2}
                className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? '' : 'group-active:scale-90'}`}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {badge > 0 && (
                <span className="bg-accent-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
              {isActive && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
            </button>
          );
        })}
      </nav>

      {/* AI Search button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => handleNav('search')}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-ink-300 hover:bg-white/10 hover:text-white transition-all group"
        >
          <Search size={19} className="shrink-0 group-hover:scale-110 transition-transform" />
          <span>AI Search</span>
          <Mic size={14} className="ml-auto text-brand-400" />
        </button>
      </div>

      {/* Create button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => setMenuOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-sm py-3 rounded-xl active:scale-95 transition-transform hover:shadow-glow gradient-animated"
        >
          <Plus size={18} strokeWidth={2.5} />
          Create Listing
        </button>
      </div>

      {/* Location */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 px-3.5 py-2 text-xs text-ink-400">
          <MapPin size={14} className={locationEnabled ? 'text-success-500' : 'text-ink-400'} />
          <span>{locationEnabled ? 'Location active' : 'Location off'} — 7 km</span>
        </div>
      </div>

      {/* User / Auth */}
      <div className="border-t border-white/10 p-3">
        {user ? (
          <button
            onClick={() => handleNav('profile')}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors group"
          >
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.name || 'New Member'}</div>
              <div className="text-xs text-ink-400 capitalize">{user.role === 'both' ? 'Earn & Find' : user.role}</div>
            </div>
          </button>
        ) : (
          <button
            onClick={() => handleNav('auth')}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors text-ink-300"
          >
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
              <LogIn size={18} />
            </div>
            <span className="text-sm font-medium">Sign in</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-ink-900 z-40 flex-col animate-slide-in-left">
        {sidebarContent}
      </aside>

      {/* Mobile top bar with menu toggle */}
      <div className="lg:hidden sticky top-0 z-40 glass-dark border-b border-white/10 h-14 flex items-center px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-1 text-white"
          aria-label="Open menu"
        >
          <Plus size={22} className="rotate-45" />
        </button>
        <button onClick={() => navigate('home')} className="flex items-center gap-2 mx-auto">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-white">SilverHands</span>
        </button>
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 -mr-1 text-white"
          aria-label="Create"
        >
          <Plus size={22} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-ink-900 animate-slide-in-left"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-ink-400 hover:text-white p-1 z-10"
            >
              <X size={22} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {menuOpen && <PlusMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
