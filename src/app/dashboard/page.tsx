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

  useEffect(() => {
    const verificarRol = async () => {
      if (!user) return;

      console.log("user.id:", user.id); // Debug

      const { data, error } = await supabase
        .from('tecnicos')
        .select('rol')
        .eq('id', user.id) // CAMBIO CORRECTO
        .single();

      if (error) {
        console.error("Error al obtener rol del técnico:", error.message);
        setEsSupervisor(false);
        return;
      }

      console.log("Datos técnicos:", data); // Debug
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
