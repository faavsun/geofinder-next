'use client';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import tecnicosOriginales from '@/data/tecnicos.json';
import Map, { MapHandle, Tecnico } from '@/components/Map';
import PanelTecnicos from '@/components/PanelTecnicos';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/lib/useUser';

const puntoReferencia = { lat: -36.83, lon: -73.06 };
const velocidadKmh = 30;

function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const tecnicosConETA: Tecnico[] = tecnicosOriginales.map((t) => {
  const distanciaKm = calcularDistanciaKm(t.lat, t.lon, puntoReferencia.lat, puntoReferencia.lon);
  const eta = Math.max(6, Math.round((distanciaKm / velocidadKmh) * 60));
  const tiempoTrabajoMin = 15;
  const etaTotal = eta + tiempoTrabajoMin;

  return {
    ...t,
    eta,
    tiempoTrabajoMin,
    etaTotal,
  };
});

export default function PanelTecnicosPage() {
  const router = useRouter();
  const mapRef = useRef<MapHandle>(null);
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading]);

  const handleCentrar = (nombre: string) => {
    mapRef.current?.centrarEnTecnico(nombre);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (loading) return <p className="p-6">Cargando sesión...</p>;

  return (
    <main className="flex flex-col md:flex-row h-screen relative">
      {/* Encabezado */}
      <div className="absolute top-4 right-6 text-sm text-right z-10">
        <p className="text-gray-600">Sesión: {user?.email}</p>
        <button
          onClick={handleLogout}
          className="text-blue-600 hover:underline text-sm"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Panel y Mapa */}
      <section className="w-full md:w-2/3 p-4">
        <h1 className="text-2xl font-bold mb-4">Panel de Técnicos</h1>
        <Map ref={mapRef} tecnicos={tecnicosConETA} />
      </section>

      <aside className="w-full md:w-1/3 bg-gray-100 p-4 overflow-y-auto">
        <PanelTecnicos tecnicos={tecnicosConETA} onCentrar={handleCentrar} />
      </aside>
    </main>
  );
}
