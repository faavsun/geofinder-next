'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Map, { MapHandle, Tecnico, Cliente } from '@/components/Map';
import PanelTecnicos from '@/components/PanelTecnicos';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/lib/useUser';

export default function PanelTecnicosPage() {
  const router = useRouter();
  const mapRef = useRef<MapHandle>(null);
  const { user, loading } = useUser();

  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [rolUsuario, setRolUsuario] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: tecnicosData } = await supabase.from('tecnicos').select('*');
      const { data: clientesData } = await supabase.from('clientes').select('*');

      const tecnicoActual = tecnicosData?.find(t => t.email === user?.email);
      console.log('Rol del usuario:', tecnicoActual?.rol);
      setRolUsuario(tecnicoActual?.rol || null);

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
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleCentrar = (nombre: string) => {
    mapRef.current?.centrarEnTecnico(nombre);
  };

  if (!isMounted || loading) return <p className="p-6">Cargando sesión...</p>;

  return (
    <main className="flex flex-col md:flex-row h-screen relative">
      <section className="w-full md:w-2/3 p-4">
        <h1 className="text-2xl font-bold mb-4">Panel de Técnicos</h1>
        <Map ref={mapRef} tecnicos={tecnicos} clientes={clientes} />
      </section>

      <aside className="w-full md:w-1/3 bg-gray-100 p-4 overflow-y-auto space-y-4">
        <PanelTecnicos tecnicos={tecnicos} clientes={clientes} onCentrar={handleCentrar} />
      </aside>
    </main>
  );
}

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
