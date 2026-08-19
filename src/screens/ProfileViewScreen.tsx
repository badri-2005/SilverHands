import { useApp } from '../AppContext';
import { CategoryBadge } from '../components/CategoryBadge';
import { Star, MapPin, BadgeCheck, Heart, MessageCircle, Calendar, Clock, Languages, CheckCircle2, Sparkles, Shield } from 'lucide-react';
import { formatPrice, formatDistance } from '../utils';
import { useState } from 'react';

export function ProfileViewScreen() {
  const { selectedProvider, navigate, openChat, savedProviders, toggleSave, user } = useApp();
  const [showBooking, setShowBooking] = useState(false);

  if (!selectedProvider) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center text-ink-400">Profile not found.</div>
    );
  }

  const p = selectedProvider;
  const saved = savedProviders.includes(p.id);

  const handleMessage = () => {
    if (!user) { navigate('auth'); return; }
    openChat(p.id);
    navigate('chat', { providerId: p.id });
  };

  const handleBook = () => {
    if (!user) { navigate('auth'); return; }
    setShowBooking(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-6">
      <div className="grid lg:grid-cols-[1fr_340px] gap-8 animate-fade-in">
        {/* Main column */}
        <div>
          {/* Hero */}
          <div className="relative h-64 bg-gradient-to-br from-brand-400 to-brand-600 rounded-3xl overflow-hidden">
            <img src={p.avatar} alt={p.name} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{p.name}</h1>
                  {p.verified && <BadgeCheck size={24} className="text-brand-200" fill="currentColor" stroke="white" />}
                </div>
                <p className="text-white/90 mt-0.5">{p.skillTitle}</p>
                <p className="text-sm text-white/70 mt-1 flex items-center gap-1"><MapPin size={14} /> {p.locationArea} (approx. {formatDistance(p.distanceKm)} away)</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-2xl px-4 py-2.5 text-center">
                <div className="font-bold text-2xl">{p.matchScore}%</div>
                <div className="text-[10px] text-white/80">Match</div>
              </div>
            </div>
          </div>

          {/* AI match banner */}
          <div className="mt-5 bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-4 text-white flex items-center gap-3">
            <Sparkles size={22} className="shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-sm">{p.matchScore}% Match for you</div>
              <div className="text-xs text-white/80">Based on your needs, location, and availability</div>
            </div>
          </div>

          {/* About */}
          <section className="mt-6">
            <h3 className="font-bold text-ink-900 mb-2">About</h3>
            <p className="text-ink-600 leading-relaxed">{p.bio}</p>
          </section>

          {/* Skills */}
          <section className="mt-6">
            <h3 className="font-bold text-ink-900 mb-2.5">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {p.skills.map(s => (
                <span key={s} className="bg-brand-50 text-brand-700 text-sm font-medium px-3.5 py-2 rounded-full">{s}</span>
              ))}
            </div>
          </section>

          {/* Details */}
          <section className="mt-6">
            <h3 className="font-bold text-ink-900 mb-3">Details</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <DetailRow icon={Star} label="Experience" value={`${p.experienceYears} years`} />
              <DetailRow icon={Clock} label="Availability" value={p.availability} />
              <DetailRow icon={Languages} label="Languages" value={p.languages.join(', ')} />
              <DetailRow icon={CheckCircle2} label="Response time" value={p.responseTime} />
              <DetailRow icon={Shield} label="Verification" value={p.verified ? 'ID verified' : 'Pending'} />
              <DetailRow icon={CategoryBadge} category={p.category} label="Category" value={p.category} />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24 self-start">
          {/* Stats */}
          <div className="bg-white border border-ink-100 rounded-2xl p-5 grid grid-cols-3 divide-x divide-ink-100">
            <Stat label="Rating" value={p.rating.toString()} sub={`${p.reviews} reviews`} />
            <Stat label="Jobs" value={p.completedJobs.toString()} sub="completed" />
            <Stat label="Distance" value={formatDistance(p.distanceKm)} sub={p.locationArea} />
          </div>

          {/* Price */}
          <div className="bg-white border border-ink-100 rounded-2xl p-5">
            <div className="text-sm text-ink-500">Starting from</div>
            <div className="text-3xl font-bold text-brand-600 mt-1">{formatPrice(p.priceFrom)}</div>
            <p className="text-xs text-ink-400 mt-1">Final price varies based on your requirements</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleBook}
              className="w-full bg-brand-500 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-glow"
            >
              <Calendar size={20} /> Book Now
            </button>
            <button
              onClick={handleMessage}
              className="w-full bg-white border-2 border-brand-200 text-brand-600 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <MessageCircle size={20} /> Send Message
            </button>
            <button
              onClick={() => toggleSave(p.id)}
              className="w-full bg-white border-2 border-ink-200 text-ink-600 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Heart size={20} className={saved ? 'fill-error-500 text-error-500' : ''} />
              {saved ? 'Saved' : 'Save profile'}
            </button>
          </div>

          {/* Trust */}
          <div className="bg-ink-50 rounded-2xl p-4 text-sm text-ink-500 leading-relaxed">
            <div className="flex items-center gap-2 font-semibold text-ink-700 mb-1">
              <Shield size={16} className="text-brand-500" /> SilverHands Trust
            </div>
            All providers are reviewed by our team. Always meet in public places and use in-app booking for safety.
          </div>
        </div>
      </div>

      {showBooking && <BookingSheet provider={p} onClose={() => setShowBooking(false)} />}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="text-center px-2">
      <div className="font-bold text-ink-900">{value}</div>
      <div className="text-xs text-ink-500 mt-0.5">{label}</div>
      <div className="text-[10px] text-ink-400">{sub}</div>
    </div>
  );
}

function DetailRow({ icon: Icon, category, label, value }: { icon: any; category?: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-ink-50 rounded-xl p-3">
      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shrink-0">
        {category ? <CategoryBadge category={category} size={36} /> : <Icon size={18} className="text-ink-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-ink-400">{label}</div>
        <div className="text-sm font-medium text-ink-800">{value}</div>
      </div>
    </div>
  );
}

function BookingSheet({ provider, onClose }: { provider: any; onClose: () => void }) {
  const { navigate } = useApp();
  const [date, setDate] = useState('Tomorrow');
  const [time, setTime] = useState('10:00 AM');
  const [confirmed, setConfirmed] = useState(false);

  const dates = ['Today', 'Tomorrow', 'Sat, Aug 17', 'Sun, Aug 18', 'Mon, Aug 19'];
  const times = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

  if (confirmed) {
    return (
      <div className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center px-6" onClick={onClose}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-scale-in" onClick={e => e.stopPropagation()}>
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} className="text-success-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-ink-900">Booking Confirmed!</h2>
          <p className="text-ink-500 mt-1.5 text-sm">{provider.name} will see your request and confirm shortly. You'll get a message.</p>
          <div className="bg-ink-50 rounded-2xl p-4 mt-5 text-left">
            <div className="flex justify-between text-sm mb-1.5"><span className="text-ink-500">Service</span><span className="font-medium text-ink-800">{provider.skillTitle}</span></div>
            <div className="flex justify-between text-sm mb-1.5"><span className="text-ink-500">Date</span><span className="font-medium text-ink-800">{date}</span></div>
            <div className="flex justify-between text-sm mb-1.5"><span className="text-ink-500">Time</span><span className="font-medium text-ink-800">{time}</span></div>
            <div className="flex justify-between text-sm"><span className="text-ink-500">Estimated price</span><span className="font-bold text-brand-600">from {formatPrice(provider.priceFrom)}</span></div>
          </div>
          <button onClick={() => { onClose(); navigate('messages'); }} className="mt-5 w-full bg-brand-500 text-white font-semibold py-3.5 rounded-2xl active:scale-95 transition-transform">
            View in Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center px-6" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-scale-in max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1.5 bg-ink-200 rounded-full mx-auto mb-4" />
        <h2 className="text-xl font-bold text-ink-900">Book {provider.name}</h2>
        <p className="text-sm text-ink-500 mt-1">{provider.skillTitle}</p>

        <div className="mt-5">
          <label className="text-sm font-medium text-ink-600">Select date</label>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-2 pb-1">
            {dates.map(d => (
              <button key={d} onClick={() => setDate(d)} className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${date === d ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-600'}`}>{d}</button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-ink-600">Select time</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {times.map(t => (
              <button key={t} onClick={() => setTime(t)} className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${time === t ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-600'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="mt-5 bg-ink-50 rounded-2xl p-4">
          <div className="flex justify-between text-sm"><span className="text-ink-500">Estimated price</span><span className="font-bold text-brand-600">from {formatPrice(provider.priceFrom)}</span></div>
          <p className="text-xs text-ink-400 mt-1">Final price confirmed after chat with {provider.name}</p>
        </div>

        <button onClick={() => setConfirmed(true)} className="mt-5 w-full bg-brand-500 text-white font-semibold py-3.5 rounded-2xl active:scale-95 transition-transform">Confirm Booking</button>
        <button onClick={onClose} className="mt-2 w-full text-ink-500 font-medium py-2">Cancel</button>
      </div>
    </div>
  );
}
