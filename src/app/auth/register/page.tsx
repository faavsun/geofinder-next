'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Crear cuenta en auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError || !signUpData.user) {
      setError(signUpError?.message || 'No se pudo registrar');
      return;
    }

    // 2. Insertar en tabla tecnicos con rol fijo: tecnico
    const tecnico = {
      id: signUpData.user.id,
      nombre,
      especialidad,
      estado: 'disponible',
      lat: -36.82,
      lon: -73.05,
      tiempo_trabajo: 15,
      slug: uuidv4(),
      rol: 'tecnico', // 👈 SIEMPRE será "tecnico"
    };

    const { error: insertError } = await supabase.from('tecnicos').insert(tecnico);

    if (insertError) {
      setError('Usuario creado, pero ocurrió un error al guardar los datos del técnico.');
      return;
    }

    router.push('/panel-tecnicos');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Registrarse como Técnico</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Especialidad</label>
            <input
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Registrarse
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          ¿Ya tienes una cuenta?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </main>
  );
}
