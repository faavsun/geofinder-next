// src/app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      

      <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <Image
          src="/icons/cliente.png"
          width={80}
          height={80}
          alt="GeoFinder logo"
          className="mb-6"
        />

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenido a GeoFinder</h1>
        <p className="text-gray-600 max-w-xl mb-6">
          Encuentra al técnico más cercano y gestiona servicios de forma eficiente. Nuestra plataforma asigna automáticamente técnicos según ubicación.
        </p>

        <Link
          href="/auth/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
        >
          Iniciar sesión
        </Link>
      </section>
    </main>
  );
}
