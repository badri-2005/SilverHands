import { useApp } from '../AppContext';
import { PROVIDERS } from '../mockData';
import { IndianRupee, Eye, Calendar, Star, TrendingUp, ShoppingBag, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function DashboardScreen() {
  const { navigate, user } = useApp();
  const [tab, setTab] = useState<'earn' | 'find'>('earn');

  const isProvider = user?.role === 'earn' || user?.role === 'both';
  const activeTab = isProvider ? tab : 'find';

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <h1 className="text-2xl font-bold text-ink-900 animate-slide-right">Dashboard</h1>
      <p className="text-ink-500 mb-6">Track your earnings, bookings, and activity on SilverHands.</p>

      {/* Toggle */}
      {isProvider && (
        <div className="inline-flex bg-ink-100 rounded-xl p-1 mb-6">
          <button onClick={() => setTab('earn')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'earn' ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-500'}`}>
            Earning
          </button>
          <button onClick={() => setTab('find')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'find' ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-500'}`}>
            Finding
          </button>
        </div>
      )}

      {activeTab === 'earn' ? <ProviderDashboard navigate={navigate} /> : <CustomerDashboard navigate={navigate} />}
    </div>
  );
}

function ProviderDashboard({ navigate }: { navigate: (s: any) => void }) {
  return (
    <div className="space-y-6">
      {/* Earnings hero */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
          <div className="relative">
            <div className="text-sm text-white/80">Total earnings (this month)</div>
            <div className="text-4xl font-bold mt-1 flex items-center"><IndianRupee size={28} />12,450</div>
            <div className="flex items-center gap-1 mt-2 text-sm"><TrendingUp size={16} /> +18% from last month</div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6 relative">
            <MiniStat label="This week" value="₹3,200" />
            <MiniStat label="Pending" value="₹1,800" />
            <MiniStat label="Jobs" value="34" />
          </div>
        </div>

        {/* AI suggestion */}
        <div className="bg-gradient-to-br from-accent-50 to-brand-50 border border-accent-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-accent-600 mb-2">
            <Sparkles size={16} /> AI Suggestion
          </div>
          <p className="text-sm text-ink-700 leading-relaxed">You could increase your price by 12% — demand for cooking services in Jayanagar is high this week and your rating (4.9) is above average.</p>
          <button onClick={() => navigate('pricing')} className="mt-3 text-sm font-medium text-brand-600 flex items-center gap-1">
            Recalculate price <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon={Eye} label="Profile views" value="48" change="+12 this week" color="bg-brand-50 text-brand-600" />
        <StatBox icon={Calendar} label="Bookings" value="34" change="3 upcoming" color="bg-success-50 text-success-600" />
        <StatBox icon={MessageCircle} label="Messages" value="22" change="5 new" color="bg-accent-50 text-accent-600" />
        <StatBox icon={Star} label="Rating" value="4.9" change="128 reviews" color="bg-warning-50 text-warning-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <div>
          <h3 className="font-bold text-ink-900 mb-3">Recent bookings</h3>
          <div className="bg-white border border-ink-100 rounded-2xl divide-y divide-ink-100">
            {[
              { name: 'Priya S.', service: 'Tiffin (5 boxes)', date: 'Tomorrow, 8 AM', price: 300, status: 'upcoming' },
              { name: 'Rajesh M.', service: 'Catering (small)', date: 'Aug 18, 1 PM', price: 1500, status: 'upcoming' },
              { name: 'Anita K.', service: 'Mysore Pak (500g)', date: 'Yesterday', price: 180, status: 'completed' },
              { name: 'Sunil R.', service: 'Daily meals', date: 'Aug 14', price: 4200, status: 'completed' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <img src={PROVIDERS[i % 4].avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-ink-800 truncate">{b.service}</div>
                  <div className="text-xs text-ink-400">{b.name} • {b.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-brand-600">₹{b.price}</div>
                  <span className={`text-[10px] font-medium ${b.status === 'upcoming' ? 'text-brand-500' : 'text-success-600'}`}>
                    {b.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-bold text-ink-900 mb-3">Products sold</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { label: 'This month', value: '18', sub: 'items' },
              { label: 'Revenue', value: '₹4,200', sub: 'from products' },
              { label: 'Top item', value: 'Mysore Pak', sub: '8 sold' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-ink-100 rounded-2xl p-3 text-center">
                <div className="font-bold text-ink-900 text-sm">{s.value}</div>
                <div className="text-xs text-ink-500">{s.label}</div>
                <div className="text-[10px] text-ink-400">{s.sub}</div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('products')} className="w-full bg-ink-50 rounded-2xl py-3 flex items-center justify-center gap-2 text-sm font-medium text-ink-600 hover:bg-ink-100 transition-colors">
            <ShoppingBag size={16} /> Manage products
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomerDashboard({ navigate }: { navigate: (s: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="relative">
          <div className="text-sm text-white/80">Welcome back!</div>
          <div className="text-2xl font-bold mt-1">You have 2 upcoming bookings</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bookings */}
        <div>
          <h3 className="font-bold text-ink-900 mb-3">Your bookings</h3>
          <div className="bg-white border border-ink-100 rounded-2xl divide-y divide-ink-100">
            {[
              { provider: PROVIDERS[0], service: 'Tiffin delivery', date: 'Tomorrow, 8 AM', status: 'upcoming' },
              { provider: PROVIDERS[1], service: 'Math tutoring', date: 'Sat, Aug 17, 5 PM', status: 'upcoming' },
              { provider: PROVIDERS[6], service: 'Fan repair', date: 'Aug 12', status: 'completed' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <img src={b.provider.avatar} alt="" className="w-11 h-11 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-ink-800 truncate">{b.service}</div>
                  <div className="text-xs text-ink-400">{b.provider.name} • {b.date}</div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${b.status === 'upcoming' ? 'bg-brand-50 text-brand-600' : 'bg-success-50 text-success-600'}`}>
                  {b.status === 'upcoming' ? 'Upcoming' : 'Done'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Purchases */}
        <div>
          <h3 className="font-bold text-ink-900 mb-3">Recent purchases</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Mysore Pak (500g)', price: 180, seller: 'Lakshmi Amma' },
              { name: 'Terracotta Diya Set', price: 250, seller: 'Meena Iyer' },
            ].map((p, i) => (
              <div key={i} className="bg-white border border-ink-100 rounded-2xl p-4">
                <div className="font-medium text-sm text-ink-800">{p.name}</div>
                <div className="text-xs text-ink-400 mt-0.5">{p.seller}</div>
                <div className="font-bold text-brand-600 mt-2">₹{p.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI recommendations */}
      <div>
        <h3 className="font-bold text-ink-900 mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-brand-500" /> Recommended for you
        </h3>
        <div className="bg-gradient-to-r from-brand-50 to-accent-50 border border-brand-100 rounded-2xl p-5">
          <p className="text-ink-700 leading-relaxed">Based on your bookings, you might also like: <strong>Cooking classes</strong> from Lakshmi Amma or <strong>Handmade gifts</strong> from Meena Iyer.</p>
          <button onClick={() => navigate('discover')} className="mt-3 text-sm font-medium text-brand-600 flex items-center gap-1">
            Explore more <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/15 rounded-xl p-2.5 text-center">
      <div className="font-bold text-sm">{value}</div>
      <div className="text-[10px] text-white/80">{label}</div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, change, color }: { icon: any; label: string; value: string; change: string; color: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
      <div className="mt-2.5">
        <div className="text-2xl font-bold text-ink-900">{value}</div>
        <div className="text-xs text-ink-500">{label}</div>
        <div className="text-[10px] text-ink-400 mt-0.5">{change}</div>
      </div>
    </div>
  );
}
