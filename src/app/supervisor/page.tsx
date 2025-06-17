'use client';
import { useUser } from '@/lib/useUser';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SupervisorPage() {
  const { user } = useUser();
  const [rol, setRol] = useState<string | null>(null);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRolYDatos = async () => {
      if (user?.id) {
        console.log('USER ID:', user.id); 
        const { data: tecnico, error } = await supabase
          .from('tecnicos')
          .select('rol')
          .eq('id', user.id)
          .single();

        if (tecnico?.rol === 'supervisor') {
          setRol('supervisor');

          const { data: tecnicosData } = await supabase
            .from('tecnicos')
            .select('slug, nombre, especialidad, estado');

          setTecnicos(tecnicosData || []);
        }
      }
      setLoading(false);
    };

    cargarRolYDatos();
  }, [user]);

  if (loading) return <p className="p-6">Cargando...</p>;
  if (rol !== 'supervisor') return <p className="p-6">Acceso restringido.</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vista Supervisor: Técnicos registrados</h1>
      <ul className="space-y-4">
        {tecnicos.map((t) => (
          <li key={t.slug} className="bg-white p-4 shadow rounded border">
            <p className="font-semibold">{t.nombre}</p>
            <p className="text-sm text-gray-500">{t.especialidad} · {t.estado}</p>
            <Link href={`/tecnicos/${t.slug}`} className="text-blue-600 text-sm underline mt-2 inline-block">
              Ver perfil
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
