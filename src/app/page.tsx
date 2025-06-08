'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Bienvenido a <span className="text-blue-600">GeoFinder</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Encuentra técnicos cercanos y obtén estimaciones de tiempo en tiempo real con total precisión.
        </p>

        <button
          onClick={() => router.push('/panel')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium px-6 py-3 rounded-full shadow transition"
        >
          Ver Panel de Técnicos
        </button>
      </div>
    </main>
  );
}
