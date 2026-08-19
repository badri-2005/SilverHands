import { useState } from 'react';
import { useApp } from '../AppContext';
import { Sparkles, TrendingUp, IndianRupee, Info, Check, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../mockData';
import type { Category } from '../types';
import { CategoryPill } from '../components/CategoryBadge';

export function PricingScreen() {
  const { navigate } = useApp();
  const [category, setCategory] = useState<Category | null>(null);
  const [skill, setSkill] = useState('');
  const [experience, setExperience] = useState(10);
  const [materialCost, setMaterialCost] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = () => {
    if (!category || !skill.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const basePrices: Record<string, number> = {
        Teaching: 250, Tailoring: 150, Cooking: 80, Gardening: 300,
        Childcare: 200, Handicrafts: 120, Music: 400, Languages: 350,
        Consulting: 500, Beauty: 250, Repairs: 120, Art: 600,
      };
      const base = basePrices[category] || 200;
      const expMultiplier = 1 + (experience / 40) * 0.8;
      const materialAdd = materialCost * 0.3;
      const low = Math.round((base * expMultiplier + materialAdd) * 0.85);
      const mid = Math.round(base * expMultiplier + materialAdd);
      const high = Math.round((base * expMultiplier + materialAdd) * 1.25);

      setResult({
        recommended: mid,
        range: { low, high },
        factors: [
          { label: 'Base market rate', value: `₹${base}`, note: 'Average for this skill in your area' },
          { label: 'Experience multiplier', value: `${experience} yrs → +${Math.round((expMultiplier - 1) * 100)}%`, note: 'More experience commands higher rates' },
          { label: 'Material cost allowance', value: `+₹${Math.round(materialAdd)}`, note: '30% margin on materials' },
          { label: 'Local demand', value: 'High', note: '3 active seekers nearby this week' },
          { label: 'Competitor pricing', value: `₹${Math.round(base * 0.9)}–₹${Math.round(base * 1.3)}`, note: 'Based on 6 similar providers' },
        ],
      });
      setAnalyzing(false);
    }, 1800);
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2 animate-slide-right"><Sparkles size={24} className="text-brand-500" /> AI Pricing Assistant</h1>
      <p className="text-ink-500 mt-1 mb-6">Get a fair price suggestion based on your skill, experience, material costs, local demand, and nearby market rates.</p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        {!result && !analyzing && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="text-sm font-medium text-ink-600">What do you offer?</label>
              <div className="flex gap-2 flex-wrap mt-2">
                {CATEGORIES.map(c => (
                  <CategoryPill key={c.name} category={c.name} active={category === c.name} onClick={() => setCategory(c.name)} />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ink-600">Describe your service</label>
              <input
                value={skill}
                onChange={e => setSkill(e.target.value)}
                placeholder="e.g., Home-style South Indian meals"
                className="mt-2 w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3.5 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-ink-600">Years of experience</span>
                <span className="font-bold text-brand-600">{experience} years</span>
              </div>
              <input type="range" min={0} max={45} value={experience} onChange={e => setExperience(Number(e.target.value))} className="w-full accent-brand-500 h-2" />
            </div>

            <div>
              <label className="text-sm font-medium text-ink-600">Material cost per service (optional)</label>
              <div className="mt-2 flex items-center gap-2 bg-ink-50 border border-ink-200 rounded-xl px-4 py-3.5 focus-within:border-brand-400 transition-all">
                <IndianRupee size={18} className="text-ink-400" />
                <input type="number" value={materialCost || ''} onChange={e => setMaterialCost(Number(e.target.value) || 0)} placeholder="0" className="flex-1 bg-transparent outline-none text-sm" />
              </div>
            </div>

            <button
              onClick={analyze}
              disabled={!category || !skill.trim()}
              className="w-full bg-brand-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all"
            >
              <Sparkles size={18} /> Suggest a price
            </button>
          </div>
        )}

        {analyzing && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center">
              <TrendingUp size={28} className="text-brand-500 animate-pulse" />
            </div>
            <p className="mt-4 text-sm text-ink-500">Analyzing market rates near you...</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-white border-2 border-brand-200 rounded-2xl p-6 text-center shadow-glow">
              <div className="text-sm text-ink-500">Recommended price</div>
              <div className="text-5xl font-bold text-brand-600 mt-1">₹{result.recommended}</div>
              <div className="text-sm text-ink-400 mt-1">per service / session</div>
              <div className="flex justify-center gap-4 mt-4">
                <div className="bg-ink-50 rounded-xl px-5 py-2.5">
                  <div className="text-xs text-ink-400">Low</div>
                  <div className="font-bold text-ink-600">₹{result.range.low}</div>
                </div>
                <div className="bg-success-50 rounded-xl px-5 py-2.5">
                  <div className="text-xs text-success-600">Best</div>
                  <div className="font-bold text-success-600">₹{result.range.high}</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-ink-100 rounded-2xl p-5">
              <h3 className="font-bold text-ink-900 mb-3 flex items-center gap-2">
                <Info size={16} className="text-brand-500" /> How we calculated this
              </h3>
              <div className="space-y-3">
                {result.factors.map((f: any) => (
                  <div key={f.label} className="flex items-start justify-between gap-3 pb-3 border-b border-ink-100 last:border-0 last:pb-0">
                    <div>
                      <div className="text-sm font-medium text-ink-800">{f.label}</div>
                      <div className="text-xs text-ink-400">{f.note}</div>
                    </div>
                    <div className="text-sm font-semibold text-brand-600 shrink-0">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setResult(null); setSkill(''); }} className="flex-1 bg-white border-2 border-ink-200 text-ink-600 font-semibold py-3.5 rounded-xl active:scale-95 transition-transform">
                Recalculate
              </button>
              <button onClick={() => navigate('listing')} className="flex-[1.5] bg-brand-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <Check size={18} /> Use this price
              </button>
            </div>
          </div>
        )}

        {/* Info panel (always visible alongside form) */}
        {!result && !analyzing && (
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-6 text-white sticky top-24">
              <div className="flex items-center gap-2 text-sm font-medium mb-3">
                <Sparkles size={18} /> Why use AI Pricing?
              </div>
              <div className="space-y-4 text-sm text-white/90 leading-relaxed">
                <p>Setting the right price is hard. Too high and customers go elsewhere; too low and you undervalue your years of experience.</p>
                <p>Our AI analyses <strong>6 factors</strong> to suggest a fair price:</p>
                <ul className="space-y-2 ml-1">
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0" /> Base market rate for your skill</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0" /> Your years of experience</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0" /> Material cost allowance</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0" /> Local demand this week</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0" /> Competitor pricing nearby</li>
                  <li className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0" /> Your rating and reviews</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
