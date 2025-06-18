'use client';
import { useUser } from '@/lib/useUser';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PerfilTecnico from '@/components/PerfilTecnico';

export default function PerfilPage() {
  const { user } = useUser();
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSlug = async () => {
      if (user?.id) {
        console.log('USER ID:', user.id); 
        const { data, error } = await supabase
          .from('tecnicos')
          .select('slug')
          .eq('id', user.id)
          .single();

        if (data?.slug) setSlug(data.slug);
      }
      setLoading(false);
    };
    cargarSlug();
  }, [user]);

  if (loading) return <p className="p-6">Cargando perfil...</p>;
  if (!slug) return <p className="p-6">Perfil no encontrado.</p>;

  return (
    <main className="p-6">
      <PerfilTecnico slug={slug} />
    </main>
  );
}
