'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin } from 'lucide-react';

interface PerfilTecnicoProps {
  slug: string;
}

interface Tecnico {
  id: string;
  nombre: string;
  especialidad: string;
  estado: string;
  lat: number;
  lon: number;
}

interface Cliente {
  id: number;
  nombre: string;
  direccion: string;
  estado: string;
  tecnico_asignado: string;
  lat: number;
  lon: number;
}

export default function PerfilTecnico({ slug }: PerfilTecnicoProps) {
  const [tecnico, setTecnico] = useState<Tecnico | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchDatos = async () => {
      const { data: tecnicoData } = await supabase
        .from('tecnicos')
        .select('*')
        .eq('slug', slug)
        .single();

      const { data: clientesData } = await supabase
        .from('clientes')
        .select('*')
        .eq('tecnico_asignado', tecnicoData?.id);

      setTecnico(tecnicoData);
      setClientes(clientesData || []);
    };

    if (slug) fetchDatos();
  }, [slug]);

  const calcularDistanciaKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
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
  };

  const marcarFinalizado = async (clienteId: number) => {
    const { error } = await supabase
      .from('clientes')
      .update({ estado: 'finalizado' })
      .eq('id', clienteId);

    if (!error) {
      setClientes((prev) =>
        prev.map((c) =>
          c.id === clienteId ? { ...c, estado: 'finalizado' } : c
        )
      );

      // Verificar si quedan clientes pendientes
      const pendientes = clientes.filter(
        (c) => c.id !== clienteId && c.estado === 'pendiente'
      );

      if (pendientes.length === 0 && tecnico) {
        await supabase.from('tecnicos').update({ estado: 'disponible' }).eq('id', tecnico.id);
        setTecnico({ ...tecnico, estado: 'disponible' });
      }
    }
  };

  if (!tecnico) return <p className="p-6">Técnico no encontrado</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mt-4 mb-2">{tecnico.nombre}</h1>
      <p className="text-gray-600">
        {tecnico.especialidad} · {tecnico.estado}
      </p>

      <div className="mt-6">
        <h2 className="font-semibold text-lg mb-2">Clientes asignados</h2>
        {clientes.length === 0 ? (
          <p className="text-gray-500">No hay clientes asignados.</p>
        ) : (
          <ul className="space-y-4">
            {clientes.map((cliente) => (
              <li
                key={cliente.id}
                className="p-4 bg-white rounded shadow border"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{cliente.nombre}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <MapPin size={14} /> {cliente.direccion}
                    </p>
                    {tecnico.lat && tecnico.lon && cliente.lat && cliente.lon && (
                      <p className="text-sm text-gray-600 mt-1">
                        ETA: {Math.round(calcularDistanciaKm(tecnico.lat, tecnico.lon, cliente.lat, cliente.lon) * 60)} minutos aprox.
                      </p>
                    )}
                    <p
                      className={`text-sm mt-1 ${
                        cliente.estado === 'finalizado'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      Estado: {cliente.estado}
                    </p>
                  </div>
                  {cliente.estado !== 'finalizado' && (
                    <button
                      onClick={() => marcarFinalizado(cliente.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Marcar como finalizado
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
