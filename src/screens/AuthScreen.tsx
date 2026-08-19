import { useState } from 'react';
import { useApp } from '../AppContext';
import { supabase } from '../lib/supabase';
import { Sparkles, Mail, Lock, ChevronRight, Check, Wrench, Search, Zap, ShieldCheck, Globe, TrendingUp, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import type { UserRole } from '../types';

export function AuthScreen() {
  const { navigate } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'credentials' | 'role'>('credentials');

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (signUpError) throw signUpError;
        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email: email.trim(),
            role: role || 'find',
          });
          if (profileError && !profileError.message.includes('duplicate')) {
            throw profileError;
          }
        }
        setStep('role');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        navigate('home');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const completeSignup = () => {
    navigate('onboarding');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-20 translate-x-20 animate-float-slow" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full translate-y-32 animate-float" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <span className="font-bold text-2xl">SilverHands</span>
          </div>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight">Turn your skills into income.</h1>
          <p className="text-white/85 mt-4 text-lg leading-relaxed max-w-md">
            AI-powered platform for senior citizens and homemakers. Voice onboarding, 7 km hyperlocal discovery, and swipe-based matching.
          </p>
          <div className="mt-8 space-y-3">
            {[
              { icon: Globe, text: 'Voice onboarding in 6 Indian languages' },
              { icon: TrendingUp, text: 'AI matches you with nearby customers' },
              { icon: ShieldCheck, text: 'Verified, trusted, safe community' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                  <f.icon size={20} />
                </div>
                <span className="text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-sm text-white/60">© 2026 SilverHands. Skills worth gold.</div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:p-12 max-w-lg mx-auto w-full">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
            <Sparkles size={22} className="text-white" />
          </div>
          <span className="font-bold text-xl text-ink-900">SilverHands</span>
        </div>

        {step === 'credentials' && (
          <>
            <h1 className="text-3xl font-bold text-ink-900">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-ink-500 mt-2 text-base">
              {mode === 'login'
                ? 'Sign in with your email and password to continue.'
                : 'Join SilverHands — it only takes a minute.'}
            </p>

            {/* Mode toggle */}
            <div className="mt-6 bg-ink-100 rounded-xl p-1 flex">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-500'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-500'}`}
              >
                Sign Up
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-ink-600">Email address</label>
                <div className="mt-2 flex items-center gap-2 bg-ink-50 border border-ink-200 rounded-xl px-4 py-3.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                  <Mail size={20} className="text-ink-400 shrink-0" />
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    className="flex-1 bg-transparent outline-none text-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-ink-600">Password</label>
                <div className="mt-2 flex items-center gap-2 bg-ink-50 border border-ink-200 rounded-xl px-4 py-3.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                  <Lock size={20} className="text-ink-400 shrink-0" />
                  <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    className="flex-1 bg-transparent outline-none text-lg font-medium"
                  />
                  <button
                    onClick={() => setShowPassword(s => !s)}
                    className="text-ink-400 hover:text-ink-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-error-50 border border-error-100 rounded-xl px-4 py-3 flex items-start gap-2 animate-slide-up">
                  <AlertCircle size={20} className="text-error-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-error-600">{error}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-brand-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-all text-lg"
              >
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" /> Please wait...</>
                ) : (
                  <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ChevronRight size={20} /></>
                )}
              </button>

              <p className="text-center text-sm text-ink-400">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                  className="text-brand-600 font-semibold hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </>
        )}

        {step === 'role' && (
          <>
            <h1 className="text-3xl font-bold text-ink-900">How will you use SilverHands?</h1>
            <p className="text-ink-500 mt-2 text-base">You can change this later anytime.</p>
            <div className="mt-6 flex flex-col gap-3.5">
              <RoleOption icon={Zap} title="Earn" subtitle="Offer services and sell products to earn income" active={role === 'earn'} onClick={() => setRole('earn')} />
              <RoleOption icon={Search} title="Find Services" subtitle="Discover and book trusted people near you" active={role === 'find'} onClick={() => setRole('find')} />
              <RoleOption icon={Wrench} title="Both" subtitle="Earn from your skills and book others too" active={role === 'both'} onClick={() => setRole('both')} />
              <button onClick={completeSignup} disabled={!role} className="mt-4 w-full bg-brand-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all text-lg">
                Continue <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RoleOption({ icon: Icon, title, subtitle, active, onClick }: { icon: typeof Zap; title: string; subtitle: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${active ? 'border-brand-500 bg-brand-50' : 'border-ink-200 bg-white hover:border-ink-300'}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-500'}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-ink-900 text-lg">{title}</div>
        <div className="text-sm text-ink-500">{subtitle}</div>
      </div>
      {active && <Check size={22} className="text-brand-500" />}
    </button>
  );
}
