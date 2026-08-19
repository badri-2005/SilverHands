import { useApp } from '../AppContext';
import { PROVIDERS } from '../mockData';
import { ProviderCard } from '../components/ProviderCard';
import { TrendingUp, Eye, Calendar, IndianRupee, Star, Sparkles, Settings, LogOut, Heart, ChevronRight, BarChart3, Briefcase, ShoppingBag, MapPin, Phone } from 'lucide-react';

export function ProfileScreen() {
  const { user, navigate, setUser, savedProviders, toggleSave, setSelectedProvider } = useApp();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Sparkles size={36} className="text-brand-600" />
        </div>
        <h2 className="text-2xl font-bold text-ink-900">Welcome to SilverHands</h2>
        <p className="text-ink-500 mt-2 max-w-md mx-auto">Sign in to build your profile with voice, earn from your skills, and book trusted services near you.</p>
        <button onClick={() => navigate('auth')} className="mt-6 bg-brand-500 text-white font-semibold px-8 py-3.5 rounded-xl active:scale-95 transition-transform">
          Sign in / Sign up
        </button>
      </div>
    );
  }

  const saved = PROVIDERS.filter(p => savedProviders.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* Left sidebar — user card */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
                {user.name?.[0] || 'U'}
              </div>
              <h2 className="text-xl font-bold mt-3">{user.name || 'New Member'}</h2>
              <p className="text-sm text-white/80 flex items-center gap-1.5 mt-1"><Phone size={13} /> +91 {user.phone}</p>
              <span className="inline-block mt-2 bg-white/20 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">
                {user.role === 'both' ? 'Earn & Find' : user.role}
              </span>
              <button onClick={() => navigate('onboarding')} className="mt-4 w-full bg-white/15 backdrop-blur rounded-xl px-4 py-2 text-sm font-medium active:scale-95 transition-transform">
                Complete your profile
              </button>
            </div>
          </div>

          <div className="bg-white border border-ink-100 rounded-2xl divide-y divide-ink-100">
            <ActionRow icon={Briefcase} label="Offer a service" onClick={() => navigate('listing')} />
            <ActionRow icon={ShoppingBag} label="Sell a product" onClick={() => navigate('products')} />
            <ActionRow icon={BarChart3} label="View dashboard" onClick={() => navigate('dashboard')} />
            <ActionRow icon={Sparkles} label="AI Pricing Assistant" onClick={() => navigate('pricing')} />
            <ActionRow icon={TrendingUp} label="AI Search" onClick={() => navigate('search')} />
            <ActionRow icon={Settings} label="Settings" onClick={() => {}} />
            <ActionRow icon={LogOut} label="Sign out" onClick={() => { setUser(null); navigate('home'); }} danger />
          </div>
        </div>

        {/* Right content */}
        <div className="space-y-6">
          {/* Stats */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-ink-900">Your activity</h3>
              <button onClick={() => navigate('dashboard')} className="text-sm text-brand-600 font-medium flex items-center gap-0.5">
                Dashboard <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={Calendar} label="Bookings" value="3" sub="1 upcoming" color="bg-brand-50 text-brand-600" />
              <StatCard icon={Heart} label="Saved" value={saved.length.toString()} sub="people" color="bg-error-50 text-error-500" />
              <StatCard icon={Eye} label="Views" value="48" sub="this week" color="bg-success-50 text-success-600" />
              <StatCard icon={Star} label="Rating" value="—" sub="no reviews" color="bg-warning-50 text-warning-500" />
            </div>
          </div>

          {/* Saved providers */}
          <div>
            <h3 className="font-bold text-ink-900 mb-3">Saved people</h3>
            {saved.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {saved.map(p => (
                  <ProviderCard key={p.id} provider={p} onClick={() => { setSelectedProvider(p); navigate('profileView', { id: p.id }); }} />
                ))}
              </div>
            ) : (
              <div className="bg-ink-50 rounded-2xl p-8 text-center">
                <Heart size={28} className="text-ink-300 mx-auto mb-2" />
                <p className="text-sm text-ink-400">No saved profiles yet. Tap the heart on any profile to save them here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
      <div className="mt-2.5">
        <div className="text-2xl font-bold text-ink-900">{value}</div>
        <div className="text-xs text-ink-500">{label}</div>
        <div className="text-[10px] text-ink-400">{sub}</div>
      </div>
    </div>
  );
}

function ActionRow({ icon: Icon, label, onClick, danger }: { icon: any; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3.5 hover:bg-ink-50 transition-colors text-left ${danger ? 'text-error-600' : ''}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? 'bg-error-50' : 'bg-ink-50'}`}>
        <Icon size={18} className={danger ? 'text-error-500' : 'text-ink-600'} />
      </div>
      <span className={`flex-1 font-medium ${danger ? 'text-error-600' : 'text-ink-800'}`}>{label}</span>
      {!danger && <ChevronRight size={18} className="text-ink-300" />}
    </button>
  );
}
