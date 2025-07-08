'use client';

import { useUser } from '@/lib/useUser';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AgregarClienteForm from '@/components/AgregarClienteForm';

export default function SupervisorPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [rol, setRol] = useState<string | null>(null);

  // 🔐 Redirección si no hay sesión
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Obtener rol del usuario
  useEffect(() => {
    const verificarRol = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('tecnicos')
          .select('rol')
          .eq('id', user.id)
          .single();

        if (!error && data?.rol) {
          setRol(data.rol);
        }
      }
    };
    verificarRol();
  }, [user]);

  // Cargar técnicos si es supervisor
  useEffect(() => {
    const cargarTecnicos = async () => {
      const { data } = await supabase
        .from('tecnicos')
        .select('slug, nombre, especialidad, estado');
      setTecnicos(data || []);
    };

    if (rol === 'supervisor') cargarTecnicos();
  }, [rol]);

  const actualizarClientes = () => {
    // Puedes volver a cargar lista si es necesario
  };

  // Validación de acceso
  if (loading || !user || rol !== 'supervisor') {
    return <p className="p-6">Acceso restringido.</p>;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Vista Supervisor</h1>

      <AgregarClienteForm onAgregado={actualizarClientes} />

      <h2 className="text-lg font-semibold mt-10 mb-4">Técnicos registrados</h2>
      <ul className="space-y-4">
        {tecnicos.map((t) => (
          <li key={t.slug} className="bg-white p-4 shadow rounded border">
            <p className="font-semibold">{t.nombre}</p>
            <p className="text-sm text-gray-500">
              {t.especialidad} · {t.estado}
            </p>
            <Link
              href={`/tecnicos/${t.slug}`}
              className="text-blue-600 text-sm underline mt-2 inline-block"
            >
              Ver perfil
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
