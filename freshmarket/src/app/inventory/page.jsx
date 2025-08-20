// src/app/inventory/page.jsx
export const dynamic = 'force-static'; // pure SSG snapshot

import Image from 'next/image';
import { fetchJSON } from '@/lib/api';

// Build-time helper: turn /stock array into a productId -> level map
function toStockMap(rows) {
  const map = new Map();
  for (const row of rows || []) {
    const id = String(row.productId);
    const level = row.quantity ?? row.level ?? 0; // handle either field name
    map.set(id, level);
  }
  return map;
}

export default async function InventoryPage() {
  // Both runs at build time during `next build` (and on re-build in dev):
  const [products, stockRows] = await Promise.all([
    fetchJSON('/products'), // array of products
    fetchJSON('/stock'),    // array like [{productId, level}, ...]
  ]);

  const stock = toStockMap(stockRows);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Inventory (Build-time Snapshot)</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const qty = stock.get(String(p.id)) ?? 0;
          return (
            <div key={p.id} className="card overflow-hidden hover:shadow-md transition">
              <Image
                src={p.image}
                alt={p.name}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{p.name}</h3>
                <p className="text-emerald-700 font-medium mb-2">
                  ₹{p.price} {p.unit && <span className="text-gray-500">({p.unit})</span>}
                </p>
                {/* Build-time stock (no SWR/polling here) */}
                <p className="text-sm text-gray-600">Stock (build): {qty}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}