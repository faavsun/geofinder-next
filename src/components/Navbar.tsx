'use client';
import Link from 'next/link';
import { useUser } from '@/lib/useUser';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // ✅ fuerza actualización del estado de sesión
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 shadow bg-white">
      <div>
        <Link href="/" className="text-xl font-bold text-blue-600">GeoFinder</Link>
        <p className="text-sm text-gray-400">Servicios Técnicos Nacionales</p>
      </div>

      <div className="flex gap-4 items-center text-sm text-gray-700">
        {user ? (
          <>
            <Link href="/panel-tecnicos">🗺️ Mapa</Link>
            <Link href="/perfil">👤 Perfiles</Link>
            <Link href="/supervisor">👥 Supervisor</Link>
            <span className="hidden sm:inline text-gray-600">{user.email}</span>
            <button onClick={logout} className="text-blue-600 hover:underline">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link href="/">Inicio</Link>
            <Link href="/auth/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
