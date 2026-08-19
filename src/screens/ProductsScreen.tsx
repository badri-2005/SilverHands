import { useApp } from '../AppContext';
import { PRODUCTS, CATEGORIES, PROVIDERS } from '../mockData';
import { ProductCard } from '../components/ProductCard';
import { CategoryPill } from '../components/CategoryBadge';
import { useState } from 'react';
import type { Category } from '../types';

export function ProductsScreen() {
  const { setSelectedProvider, navigate } = useApp();
  const [activeCat, setActiveCat] = useState<Category | 'All'>('All');

  const filtered = activeCat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCat);

  const openProduct = (id: string) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) {
      const p = PROVIDERS.find(x => x.id === product.sellerId);
      if (p) setSelectedProvider(p);
      navigate('profileView', { id: product.sellerId });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <h1 className="text-2xl font-bold text-ink-900">Handmade Products</h1>
      <p className="text-ink-500 mb-6">Discover homemade food, crafts, clothes, paintings, and jewellery from your neighbourhood.</p>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
        <CategoryPill category={'All' as Category} active={activeCat === 'All'} onClick={() => setActiveCat('All')} />
        {CATEGORIES.filter(c => PRODUCTS.some(p => p.category === c.name)).map(c => (
          <CategoryPill key={c.name} category={c.name} active={activeCat === c.name} onClick={() => setActiveCat(c.name)} />
        ))}
      </div>

      <div className="text-sm text-ink-500 mb-4">{filtered.length} products nearby</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(pr => (
          <ProductCard key={pr.id} product={pr} onClick={() => openProduct(pr.id)} />
        ))}
      </div>
    </div>
  );
}
