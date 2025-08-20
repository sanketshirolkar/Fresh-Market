import Image from 'next/image';
import Link from 'next/link';
import StockLevel from './StockLevel';

export default function ProductCard({ product, showStock = false }) {
  return (
    <div className="card overflow-hidden hover:shadow-md transition">
      <Link href={`/products/${product.id}`} className="block">
      
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          priority={false}
        />
      </Link>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-emerald-700 font-medium mb-2">
          ₹{product.price} {product.unit && <span className="text-gray-500">({product.unit})</span>}
        </p>
        {showStock && <StockLevel productId={product.id} />}
      </div>
    </div>
  );
}
