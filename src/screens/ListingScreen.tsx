import { useState } from 'react';
import { useApp } from '../AppContext';
import { CATEGORIES } from '../mockData';
import { CategoryPill } from '../components/CategoryBadge';
import { Scissors, ShoppingBag, Sparkles, Check, ChevronRight, Camera, Mic } from 'lucide-react';
import type { Category } from '../types';

export function ListingScreen() {
  const { navigate } = useApp();
  const [type, setType] = useState<'service' | 'product'>('service');
  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => { if (!category || !title.trim()) return; setSubmitted(true); };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={40} className="text-success-600" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-bold text-ink-900">{type === 'service' ? 'Service listed!' : 'Product listed!'}</h2>
        <p className="text-ink-500 mt-2 max-w-sm mx-auto">
          {type === 'service'
            ? 'People nearby can now discover and book you. You\'ll get a message when someone is interested.'
            : 'Your product is now visible to buyers within 7 km. You\'ll be notified of orders.'}
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => navigate('home')} className="bg-brand-500 text-white font-semibold px-6 py-3.5 rounded-xl active:scale-95 transition-transform">
            Back to Home
          </button>
          <button onClick={() => navigate('dashboard')} className="text-brand-600 font-medium px-4 py-3.5">
            View dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <h1 className="text-2xl font-bold text-ink-900 animate-slide-right">Create a Listing</h1>
      <p className="text-ink-500 mt-1 mb-6">Offer a service or sell a homemade product to people near you.</p>

      {/* Type toggle */}
      <div className="bg-ink-100 rounded-xl p-1 flex mb-6 max-w-sm">
        <button onClick={() => setType('service')} className={`flex-1 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${type === 'service' ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-500'}`}>
          <Scissors size={16} /> Service
        </button>
        <button onClick={() => setType('product')} className={`flex-1 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${type === 'product' ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-500'}`}>
          <ShoppingBag size={16} /> Product
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — photo + category */}
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-ink-600">Add a photo</label>
            <button className="mt-2 w-full aspect-[4/3] bg-ink-50 border-2 border-dashed border-ink-200 rounded-2xl flex flex-col items-center justify-center text-ink-400 hover:border-brand-300 transition-colors">
              <Camera size={36} />
              <span className="text-sm mt-2">Click to upload a photo</span>
              <span className="text-xs text-ink-300 mt-1">PNG, JPG up to 5MB</span>
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-ink-600">Category</label>
            <div className="flex gap-2 flex-wrap mt-2">
              {CATEGORIES.map(c => (
                <CategoryPill key={c.name} category={c.name} active={category === c.name} onClick={() => setCategory(c.name)} />
              ))}
            </div>
          </div>
        </div>

        {/* Right — details */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-600">{type === 'service' ? 'Service title' : 'Product name'}</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={type === 'service' ? 'e.g., Home-style South Indian Meals' : 'e.g., Homemade Mysore Pak (500g)'}
              className="mt-2 w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3.5 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-ink-600">Description</label>
              <button className="flex items-center gap-1 text-xs text-brand-600 font-medium"><Mic size={13} /> Speak instead</button>
            </div>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Describe what you offer, your experience, and what makes it special..."
              rows={4}
              className="mt-2 w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3.5 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink-600">Price (₹)</label>
            <div className="mt-2 flex items-center gap-2 bg-ink-50 border border-ink-200 rounded-xl px-4 py-3.5 focus-within:border-brand-400 transition-all">
              <span className="text-ink-400">₹</span>
              <input value={price} onChange={e => setPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" inputMode="numeric" className="flex-1 bg-transparent outline-none text-sm" />
            </div>
            <button onClick={() => navigate('pricing')} className="mt-2 w-full bg-brand-50 border border-brand-100 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-medium text-brand-600 hover:bg-brand-100 transition-colors">
              <Sparkles size={16} /> Not sure? Get an AI price suggestion
            </button>
          </div>
        </div>
      </div>

      <button onClick={submit} disabled={!category || !title.trim()} className="mt-8 w-full bg-brand-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-all">
        Publish {type === 'service' ? 'service' : 'product'} <ChevronRight size={20} />
      </button>
    </div>
  );
}
