import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchJSON } from '@/lib/api';
import StockLevel from '@/components/StockLevel';


export async function generateStaticParams() {
  
  const [best, fresh] = await Promise.all([
    fetchJSON('/best-sellers'),
    fetchJSON('/new-arrivals'),
  ]);

  
  const norm = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .map((x) => (typeof x === 'object' ? x.productId : x))
      .map((v) => String(v))
      .filter(Boolean);

  const ids = Array.from(new Set([...norm(best), ...norm(fresh)])); 
  return ids.map((id) => ({ id }));
}

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
          <StockLevel productId={product.id} />

          <p className="text-gray-700 mt-6 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </section>
  );
}