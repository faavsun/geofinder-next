'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MapPin } from 'lucide-react';
import { useUser } from '@/lib/useUser';

interface Tecnico {
  id: string;
  nombre: string;
  email: string;
  especialidad: string;
  estado: string;
  lat: number;
  lon: number;
  slug: string;
}

interface Cliente {
  id: number;
  nombre: string;
  direccion: string;
  estado: string;
  tecnico_asignado: string;
}

export default function PerfilTecnicoPage() {
  const { slug } = useParams();
  const { user, loading } = useUser();
  const router = useRouter();

  const [tecnico, setTecnico] = useState<Tecnico | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const puedeMarcar = user?.email === tecnico?.email;

  // 🔐 Redirigir si no hay sesión activa
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

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

    if (slug && user) fetchDatos();
  }, [slug, user]);

  const marcarFinalizado = async (clienteId: number) => {
    const { error } = await supabase
      .from('clientes')
      .update({ estado: 'finalizado' })
      .eq('id', clienteId);

    if (error) {
      console.error('Error al marcar como finalizado:', error);
      return;
    }

    setClientes((prev) =>
      prev.map((c) =>
        c.id === clienteId ? { ...c, estado: 'finalizado' } : c
      )
    );
  };

  if (!user || !tecnico) return <p className="p-6">Técnico no encontrado</p>;

  const finalizados = clientes.filter((c) => c.estado === 'finalizado').length;
  const pendientes = clientes.length - finalizados;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <a href="/panel-tecnicos" className="text-sm text-blue-600 underline">← Volver</a>
      <h1 className="text-2xl font-bold mt-4 mb-2">{tecnico.nombre}</h1>
      <p className="text-gray-600">{tecnico.especialidad} · {tecnico.estado}</p>

      <div className="mt-6">
        <h2 className="font-semibold text-lg mb-2">Clientes asignados</h2>
        {clientes.length === 0 ? (
          <p className="text-gray-500">No hay clientes asignados.</p>
        ) : (
          <ul className="space-y-4">
            {clientes.map((cliente) => (
              <li key={cliente.id} className="p-4 bg-white rounded shadow border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{cliente.nombre}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <MapPin size={14} /> {cliente.direccion}
                    </p>
                    <p className={`text-sm mt-1 ${cliente.estado === 'finalizado' ? 'text-green-600' : 'text-yellow-600'}`}>
                      Estado: {cliente.estado}
                    </p>
                  </div>
                  {cliente.estado !== 'finalizado' && puedeMarcar && (
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

      <div className="mt-10">
        <h2 className="text-lg font-bold mb-2">Estadísticas del técnico</h2>
        <p>Clientes asignados: {clientes.length}</p>
        <p>Finalizados: {finalizados}</p>
        <p>Pendientes: {pendientes}</p>
      </div>
    </main>
  );
}
