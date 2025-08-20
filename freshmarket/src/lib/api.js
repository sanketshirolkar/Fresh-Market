const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';

export async function fetchJSON(path, init) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`API error ${res.status} for ${url}`);
  return res.json();
}

export async function fetchProductsByIds(ids, init) {
  if (!ids?.length) return [];
  const q = ids.map((id) => `id=${encodeURIComponent(id)}`).join('&');
  return fetchJSON(`/products?${q}`, init);
}

export async function fetchProductsByIdsStrict(ids, init) {
  if (!ids?.length) return [];
  const unique = Array.from(new Set(ids));
  const products = await Promise.all(
    unique.map((id) => fetchJSON(`/products/${encodeURIComponent(id)}`, init))
  );
  const map = new Map(products.map((p) => [String(p.id), p])); // keys as strings for safety
  return ids.map((id) => map.get(String(id))).filter(Boolean);
}