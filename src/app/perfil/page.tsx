'use client';

import { useUser } from '@/lib/useUser';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PerfilTecnico from '@/components/PerfilTecnico';

export default function PerfilPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);
  const [cargandoSlug, setCargandoSlug] = useState(true);

  //  Redirigir si no hay sesión activa
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  //  Obtener el slug del usuario logueado
  useEffect(() => {
    const cargarSlug = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('tecnicos')
          .select('slug')
          .eq('id', user.id)
          .single();

        if (data?.slug) setSlug(data.slug);
      }
      setCargandoSlug(false);
    };

    if (user) cargarSlug();
  }, [user]);

  if (loading || cargandoSlug) return <p className="p-6">Cargando perfil...</p>;
  if (!slug) return <p className="p-6">Perfil no encontrado.</p>;

  return (
    <main className="p-6">
      <PerfilTecnico slug={slug} />
    </main>
  );
}
