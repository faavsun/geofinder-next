'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Map, { MapHandle, Tecnico, Cliente } from '@/components/Map';
import PanelTecnicos from '@/components/PanelTecnicos';
import { supabase } from '@/lib/supabase';
import AgregarClienteForm from '@/components/AgregarClienteForm';
import { useUser } from '@/lib/useUser';

export default function PanelTecnicosPage() {
  const router = useRouter();
  const mapRef = useRef<MapHandle>(null);
  const { user, loading } = useUser();

  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: tecnicosData } = await supabase.from('tecnicos').select('*');
      const { data: clientesData } = await supabase.from('clientes').select('*');

      setTecnicos(
        (tecnicosData || []).map((t) => {
          const distanciaKm = calcularDistanciaKm(t.lat, t.lon, -36.83, -73.06);
          const eta = Math.max(6, Math.round((distanciaKm / 30) * 60));
          const tiempoTrabajoMin = t.tiempo_trabajo ?? 15;
          return { ...t, eta, tiempoTrabajoMin, etaTotal: eta + tiempoTrabajoMin };
        })
      );
      setClientes(clientesData || []);
    };

    if (user) cargarDatos();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
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
      <div className="absolute top-4 right-6 text-sm text-right z-10">
        <p className="text-gray-600">Sesión: {user?.email}</p>
        <button onClick={handleLogout} className="text-blue-600 hover:underline text-sm">
          Cerrar sesión
        </button>
      </div>

      <section className="w-full md:w-2/3 p-4">
        <h1 className="text-2xl font-bold mb-4 flex justify-between items-center">
          Panel de Técnicos
          <button onClick={() => router.refresh()} className="text-sm text-blue-600 underline">
            🔄 Recargar
          </button>
        </h1>
        <Map ref={mapRef} tecnicos={tecnicos} clientes={clientes} />
      </section>

      <aside className="w-full md:w-1/3 bg-gray-100 p-4 overflow-y-auto space-y-4">
        <AgregarClienteForm onAgregado={() => router.refresh()} />
        <PanelTecnicos tecnicos={tecnicos} onCentrar={handleCentrar} />
      </aside>
    </main>
  );
}

// Haversine para ETA
function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
