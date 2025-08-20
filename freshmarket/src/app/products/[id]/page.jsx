import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchJSON } from '@/lib/api';
import StockLevel from '@/components/StockLevel';

// Build-time: pre-render “top products” (best-sellers + new-arrivals)
export async function generateStaticParams() {
  // Fetch the two ID lists from JSON Server at build time
  const [best, fresh] = await Promise.all([
    fetchJSON('/best-sellers'),
    fetchJSON('/new-arrivals'),
  ]);

  // Normalize both arrays to plain IDs
  const norm = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .map((x) => (typeof x === 'object' ? x.productId : x))
      .map((v) => String(v))
      .filter(Boolean);

  const ids = Array.from(new Set([...norm(best), ...norm(fresh)])); // union

  // Return params like: [{ id: '1' }, { id: '2' }, ...]
  return ids.map((id) => ({ id }));
}

// Optional: make this route static by default (SSG)
// (App Router pages are static unless you opt into dynamic features.)
export const dynamic = 'force-static';

async function getProduct(id) {
  try {
    return await fetchJSON(`/products/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { id } = params; // string
  const product = await getProduct(id);
  if (!product) return notFound();

  return (
    <section className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl overflow-hidden border">
          <Image
            src={product.image}
            alt={product.name}
            width={1200}
            height={800}
            className="w-full h-80 object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-emerald-700 text-lg font-medium mb-3">
            ₹{product.price}{' '}
            {product.unit && <span className="text-gray-500">({product.unit})</span>}
          </p>

          {/* Live stock (client component with SWR polling) */}
          <StockLevel productId={product.id} />

          <p className="text-gray-700 mt-6 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </section>
  );
}