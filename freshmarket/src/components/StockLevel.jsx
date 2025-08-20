'use client';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function StockLevel({ productId }) {
  const { data, error, isLoading } = useSWR(
    `http://localhost:4000/stock?productId=${productId}`,
    fetcher,
    { refreshInterval: 5000 }
  );

  if (isLoading) return <span className="text-sm text-gray-400">Loading stock…</span>;
  if (error) return <span className="text-sm text-red-600">Stock unavailable</span>;

  const first = Array.isArray(data) && data[0] ? data[0] : {};
  const qty = first.quantity ?? first.level ?? 0;

  return <span className="text-sm text-gray-600">In stock: {qty}</span>;
}
