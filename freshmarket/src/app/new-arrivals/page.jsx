// src/app/new-arrivals/page.jsx
export const dynamic = 'force-dynamic';

import ProductCard from '@/components/ProductCard';
import { fetchJSON, fetchProductsByIdsStrict } from '@/lib/api';

export default async function NewArrivalsPage() {
  const list = await fetchJSON('/new-arrivals', { cache: 'no-store' });

  // Normalize: array of numbers OR array of { productId }
  let ids = Array.isArray(list) ? list.map((x) => (typeof x === 'object' ? x.productId : x)) : [];
  ids = ids.map(Number).filter((n) => Number.isFinite(n));

  console.log('[NewArrivals] ids ->', ids); // keep this log

  if (ids.length === 0) {
    return (
      <section>
        <h1 className="text-2xl font-bold mb-6">New Arrivals</h1>
        <p className="text-gray-600">No new arrivals.</p>
      </section>
    );
  }

  // 🚫 No caching + strict per-id fetch to avoid accidental "all products"
  const products = await fetchProductsByIdsStrict(ids, { cache: 'no-store' });

  // Optional: sanity log
  console.log('[NewArrivals] count ->', products.length);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">New Arrivals</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} showStock />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">Rendered: SSR</p>
    </section>
  );
}
