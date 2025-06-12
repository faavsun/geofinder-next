'use client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido a GeoFinder</h1>
      <button
        onClick={() => router.push('/auth/login')}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Iniciar sesión
      </button>
    </main>
  );
}
