'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const linkStyle = (href: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      pathname === href ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <nav className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-blue-600">GeoFinder</Link>
      <div className="flex gap-4">
        <Link href="/" className={linkStyle('/')}>Inicio</Link>
        <Link href="/panel-tecnicos" className={linkStyle('/panel-tecnicos')}>Panel</Link>
        <Link href="/auth/login" className={linkStyle('/auth/login')}>Login</Link>
      </div>
    </nav>
  );
}
