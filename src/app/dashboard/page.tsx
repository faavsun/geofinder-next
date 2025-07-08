'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/useUser';
import { supabase } from '@/lib/supabase';
import DashboardTecnicos from '@/components/DashboardTecnicos';

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [esSupervisor, setEsSupervisor] = useState<boolean | null>(null);

  //  Protección de sesión
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // 🔎 Verificar si el usuario es supervisor
  useEffect(() => {
    const verificarRol = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('tecnicos')
        .select('rol')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error al obtener rol del técnico:', error.message);
        setEsSupervisor(false);
        return;
      }

      setEsSupervisor(data?.rol === 'supervisor');
    };

    if (!loading) verificarRol();
  }, [user, loading]);

  if (loading || esSupervisor === null) return <p>Cargando...</p>;
  if (!esSupervisor) return <p>Acceso restringido</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard de Técnicos</h1>
      <DashboardTecnicos />
    </div>
  );
}
