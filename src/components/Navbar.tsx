'use client';
import Link from 'next/link';
import { useUser } from '@/lib/useUser';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/auth/login');
    } else {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 shadow bg-white">
      <Link href="/" className="text-xl font-bold text-blue-600">GeoFinder</Link>
      <div className="flex gap-4 items-center text-sm text-gray-700">
        {user ? (
          <>
            <span className="hidden sm:inline text-gray-600">{user.email}</span>
            <button onClick={logout} className="text-blue-600 hover:underline">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link href="/" className="hover:underline">Inicio</Link>
            <Link href="/auth/login" className="hover:underline">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
