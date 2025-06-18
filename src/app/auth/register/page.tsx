'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const user = data.user;
    if (user) {
      const slug = uuidv4();
      const { error: insertError } = await supabase.from('tecnicos').insert({
        id: user.id,
        nombre: email.split('@')[0],
        especialidad: 'Soporte',
        estado: 'disponible',
        lat: -36.82,
        lon: -73.05,
        tiempo_trabajo: 15,
        slug,
        rol: 'tecnico',
      });

      if (insertError) {
        setError('Registro incompleto. Error en la base de datos.');
        return;
      }

      router.push('/panel-tecnicos');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear cuenta</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 border rounded-md"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 border rounded-md"
            placeholder="Contraseña"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
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
