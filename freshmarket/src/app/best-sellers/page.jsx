import ProductCard from '@/components/ProductCard';
import { fetchJSON, fetchProductsByIdsStrict } from '@/lib/api';

export const revalidate = 60; // ISR (60s)

export default async function BestSellersPage() {
  const list = await fetchJSON('/best-sellers'); // [{id, productId}] or [1,2,...]

  // normalize to numeric/string ids safely
  let ids = Array.isArray(list)
    ? list.map((x) => (typeof x === 'object' ? x.productId : x))
    : [];
  ids = ids.map((v) => String(v)).filter((v) => v); // use strings to match server behavior

  // strict per‑ID fetch (works even if /products?id=... misbehaves)
  const products = await fetchProductsByIdsStrict(ids);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Best Sellers</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} showStock />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">Rendered: SSG (ISR 60s)</p>
    </section>
  );
}