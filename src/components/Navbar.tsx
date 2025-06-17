// components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useUser } from '@/lib/useUser';
import { useRouter } from 'next/navigation';
import { LogOut, Map, Users, User } from 'lucide-react';

export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/logout');
    router.push('/auth/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-white shadow">
      <Link href="/" className="flex items-center space-x-2">
        <img src="/icons/truck.svg" alt="GeoFinder" className="w-6 h-6" />
        <div>
          <h1 className="text-xl font-bold text-blue-600 leading-4">GeoFinder</h1>
          <p className="text-xs text-gray-400">Servicios Técnicos Nacionales</p>
        </div>
      </Link>

      {user && (
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/panel-tecnicos"
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50"
          >
            <Map size={16} /> Mapa
          </Link>
          <Link
            href="/perfil"
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50"
          >
            <User size={16} /> Perfiles
          </Link>
          <Link
            href="/supervisor"
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50"
          >
            <Users size={16} /> Supervisor
          </Link>
          <span className="text-gray-600 text-xs hidden sm:inline">{user.email}</span>
          <button onClick={logout} className="text-blue-600 text-xs hover:underline">
            <LogOut size={14} className="inline-block mr-1" />
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
