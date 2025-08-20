import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'FreshMarket',
  description: 'Featured products built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container flex items-center justify-between py-4">
            <Link href="/" className="text-xl font-bold">
              Fresh<span className="text-emerald-600">Market</span>
            </Link>
            <nav className="flex gap-2">
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" href="/best-sellers">
                Best Sellers
              </Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" href="/new-arrivals">
                New Arrivals
              </Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" href="/inventory">
                Inventory
              </Link>
            </nav>
          </div>
        </header>

        <main className="container py-8">{children}</main>
        <footer className="mt-16 border-t bg-white">
          <div className="container py-6 text-sm text-gray-500 flex items-center justify-between">
            <span>© {new Date().getFullYear()} FreshMarket</span>
            <span>Built with Next.js + Tailwind</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
