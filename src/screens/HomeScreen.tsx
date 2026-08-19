import { useApp } from '../AppContext';
import { PROVIDERS, PRODUCTS, CATEGORIES } from '../mockData';
import { ProviderCard } from '../components/ProviderCard';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, MapPin, Mic, Flame, TrendingUp, ArrowRight, Search, ShieldCheck, Zap, Heart, Globe, Star } from 'lucide-react';
import { formatDistance } from '../utils';

export function HomeScreen() {
  const { navigate, locationEnabled, enableLocation, setSelectedProvider, user } = useApp();
  const nearby = [...PROVIDERS].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6);
  const popular = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const openProvider = (id: string) => {
    const p = PROVIDERS.find(x => x.id === id);
    if (p) { setSelectedProvider(p); navigate('profileView', { id }); }
  };

  return (
    <div>
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white overflow-hidden gradient-animated">
        {/* Floating decorative orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-20 translate-x-20 animate-float-slow" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-brand-400/10 rounded-full translate-y-32 animate-float" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl">
            <div className="animate-reveal-up">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium mb-5">
                <Sparkles size={16} className="animate-wiggle" /> AI-Powered Livelihood Platform
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Turn your skills<br />into income.
              </h1>
              <p className="text-lg text-white/85 mt-4 leading-relaxed max-w-lg">
                Senior citizens and homemakers across India — your experience matters. SilverHands uses AI and voice to build your profile, match you with nearby customers, and help you earn within 7 km of home.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(user ? 'onboarding' : 'auth')}
                  className="bg-white text-brand-600 font-semibold px-6 py-3.5 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 hover:shadow-glow-lg hover:scale-105"
                >
                  {user ? 'Build your profile' : "Get started — it's free"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('discover')}
                  className="bg-white/15 backdrop-blur border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Search size={18} /> Explore nearby
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><ShieldCheck size={18} className="text-success-400" /> Verified profiles</span>
                <span className="flex items-center gap-1.5"><Globe size={18} className="text-brand-300" /> 6 languages</span>
                <span className="flex items-center gap-1.5"><MapPin size={18} className="text-accent-400" /> 7 km radius</span>
              </div>
            </div>

            {/* Hero cards preview */}
            <div className="hidden lg:block relative h-80">
              <div className="absolute top-0 right-8 w-72 bg-white rounded-2xl shadow-2xl p-4 rotate-3 animate-float hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3">
                  <img src={PROVIDERS[0].avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink-900 text-sm truncate">{PROVIDERS[0].name}</div>
                    <div className="text-xs text-ink-500 truncate">{PROVIDERS[0].skillTitle}</div>
                  </div>
                </div>
                <div className="mt-3 bg-brand-50 rounded-lg p-2 flex items-center gap-2">
                  <Zap size={14} className="text-brand-500" />
                  <span className="text-sm font-bold text-brand-600">94% Match</span>
                  <span className="text-xs text-ink-400 ml-auto">{formatDistance(PROVIDERS[0].distanceKm)}</span>
                </div>
              </div>
              <div className="absolute top-24 left-0 w-72 bg-white rounded-2xl shadow-2xl p-4 -rotate-3 animate-float hover:rotate-0 transition-transform" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-3">
                  <img src={PROVIDERS[1].avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink-900 text-sm truncate">{PROVIDERS[1].name}</div>
                    <div className="text-xs text-ink-500 truncate">{PROVIDERS[1].skillTitle}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-600">from ₹{PROVIDERS[1].priceFrom}</span>
                  <span className="text-xs text-ink-400 flex items-center gap-1"><MapPin size={12} /> {formatDistance(PROVIDERS[1].distanceKm)}</span>
                </div>
              </div>
              <div className="absolute top-48 right-0 w-72 bg-white rounded-2xl shadow-2xl p-4 rotate-6 animate-float hover:rotate-0 transition-transform" style={{ animationDelay: '3s' }}>
                <div className="flex items-center gap-3">
                  <img src={PROVIDERS[4].avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink-900 text-sm truncate">{PROVIDERS[4].name}</div>
                    <div className="text-xs text-ink-500 truncate">{PROVIDERS[4].skillTitle}</div>
                  </div>
                </div>
                <div className="mt-3 bg-accent-50 rounded-lg p-2 flex items-center gap-2">
                  <Flame size={14} className="text-accent-500" />
                  <span className="text-sm font-medium text-accent-600">SilverSwipe match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-8 py-10 max-w-6xl">
        {/* Location banner */}
        {!locationEnabled && (
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 flex items-center gap-4 animate-slide-up">
            <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center shrink-0 animate-pulse">
              <MapPin size={24} className="text-brand-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-ink-800">Enable location for the best experience</div>
              <div className="text-sm text-ink-500">Show nearby services and skilled people within 7 km of you</div>
            </div>
            <button onClick={enableLocation} className="bg-brand-500 text-white font-semibold px-5 py-2.5 rounded-xl active:scale-95 transition-transform hover:shadow-glow whitespace-nowrap">
              Allow location
            </button>
          </div>
        )}

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { value: '2,400+', label: 'Active members' },
            { value: '18,000+', label: 'Services booked' },
            { value: '4.8★', label: 'Average rating' },
            { value: '6', label: 'Languages' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white border border-ink-100 rounded-2xl p-4 text-center hover:shadow-card transition-shadow animate-reveal-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="text-2xl font-bold text-gradient">{stat.value}</div>
              <div className="text-xs text-ink-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-ink-900">How SilverHands works</h2>
          <p className="text-ink-500 mt-1">From your voice to your first earning — in four simple steps.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { icon: Mic, title: 'Speak your skills', desc: 'Describe what you do in your own language. No typing needed.' },
              { icon: Sparkles, title: 'AI builds your profile', desc: 'We extract skills, experience, and create a professional profile automatically.' },
              { icon: Heart, title: 'Get matched nearby', desc: 'SilverSwipe and AI matching connect you with people within 7 km.' },
              { icon: TrendingUp, title: 'Chat, book & earn', desc: 'Message customers, confirm bookings, and start earning from home.' },
            ].map((step, i) => (
              <div
                key={i}
                className="group bg-white border border-ink-100 rounded-2xl p-5 hover:shadow-soft hover:-translate-y-1 transition-all animate-reveal-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-brand-500 group-hover:scale-110 transition-all">
                  <step.icon size={22} className="text-brand-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-xs font-bold text-brand-500 mb-1">STEP {i + 1}</div>
                <h3 className="font-semibold text-ink-900">{step.title}</h3>
                <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-ink-900">Browse by skill</h2>
            <button onClick={() => navigate('discover')} className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => navigate('discover', { category: cat.name })}
                className="group flex flex-col items-center gap-2 p-4 bg-white border border-ink-100 rounded-2xl hover:border-brand-300 hover:shadow-card hover:-translate-y-0.5 transition-all active:scale-95 animate-reveal-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="text-2xl group-hover:scale-125 transition-transform">{cat.emoji}</div>
                <span className="text-xs font-medium text-ink-600 text-center group-hover:text-brand-600 transition-colors">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* AI features banner */}
        <section className="mt-12">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="group bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-6 text-white relative overflow-hidden hover:shadow-glow-lg transition-shadow">
              <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all"><Sparkles size={60} /></div>
              <div className="relative">
                <div className="flex items-center gap-2 text-sm font-medium text-white/90 mb-2">
                  <TrendingUp size={18} /> AI Recommendation
                </div>
                <div className="text-xl font-bold">94% Match — {PROVIDERS[0].skillTitle}</div>
                <div className="text-sm text-white/80 mt-1 flex items-center gap-1">
                  <Star size={12} className="fill-warning-400 text-warning-400" /> {PROVIDERS[0].name} • {formatDistance(PROVIDERS[0].distanceKm)} away
                </div>
                <button
                  onClick={() => openProvider(PROVIDERS[0].id)}
                  className="mt-4 bg-white text-brand-600 text-sm font-semibold px-4 py-2 rounded-xl active:scale-95 transition-transform group-hover:gap-3 flex items-center gap-2"
                >
                  View profile <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate('search')}
              className="group bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white text-left relative overflow-hidden hover:shadow-glow-lg transition-shadow"
            >
              <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all"><Mic size={60} /></div>
              <div className="relative">
                <div className="flex items-center gap-2 text-sm font-medium text-white/90 mb-2">
                  <Search size={18} /> AI Smart Search
                </div>
                <div className="text-xl font-bold">Ask in your own words</div>
                <div className="text-sm text-white/80 mt-1">"Find a maths tutor within 5 km for Saturday"</div>
                <div className="mt-4 bg-white/20 rounded-xl px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Try it now <ArrowRight size={16} />
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('swipe')}
              className="group bg-gradient-to-br from-ink-800 to-ink-900 rounded-2xl p-6 text-white text-left relative overflow-hidden hover:shadow-glow-lg transition-shadow"
            >
              <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all"><Flame size={60} /></div>
              <div className="relative">
                <div className="flex items-center gap-2 text-sm font-medium text-white/90 mb-2">
                  <Flame size={18} /> SilverSwipe
                </div>
                <div className="text-xl font-bold">Swipe to discover</div>
                <div className="text-sm text-white/80 mt-1">Tinder-style matching for local services</div>
                <div className="mt-4 bg-white/15 rounded-xl px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Start swiping <ArrowRight size={16} />
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Nearby services */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-ink-900">Nearby services</h2>
            <button onClick={() => navigate('services')} className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              See all <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearby.map(p => (
              <ProviderCard key={p.id} provider={p} onClick={() => openProvider(p.id)} />
            ))}
          </div>
        </section>

        {/* Popular products */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-ink-900">Popular homemade goods</h2>
            <button onClick={() => navigate('products')} className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              See all <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popular.map(pr => (
              <ProductCard key={pr.id} product={pr} />
            ))}
          </div>
        </section>

        {/* CTA section */}
        <section className="mt-16 mb-4">
          <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-3xl p-8 lg:p-12 text-white text-center relative overflow-hidden gradient-animated">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-y-12 -translate-x-12 animate-float-slow" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-y-20 translate-x-20 animate-float" />
            <div className="relative">
              <h2 className="text-3xl font-bold">Your skills are worth gold.</h2>
              <p className="text-white/85 mt-3 max-w-xl mx-auto leading-relaxed">
                Join SilverHands today. Build your profile with voice, get matched with nearby customers, and start earning from your experience.
              </p>
              <button
                onClick={() => navigate('auth')}
                className="mt-6 bg-white text-brand-600 font-bold px-8 py-3.5 rounded-xl active:scale-95 transition-transform inline-flex items-center gap-2 hover:scale-105 hover:shadow-glow-lg"
              >
                Get started — it's free <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
