'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AgregarClienteForm({ onAgregado }: { onAgregado: () => void }) {
  const [form, setForm] = useState({ nombre: '', direccion: '' });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const geocodificarDireccion = async (direccion: string) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`);
    const data = await response.json();
    if (data.length === 0) throw new Error('No se encontró la dirección');
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  };

  const calcularDistanciaKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * (Math.PI / 180)) *
              Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    try {
      const { nombre, direccion } = form;
      const { lat, lon } = await geocodificarDireccion(direccion);

      // Buscar técnicos disponibles
      const { data: tecnicos, error: errorTecnicos } = await supabase
        .from('tecnicos')
        .select('*')
        .eq('estado', 'disponible');

      if (errorTecnicos) throw errorTecnicos;
      if (!tecnicos || tecnicos.length === 0) throw new Error('No hay técnicos disponibles');

      // Calcular distancia y elegir el más cercano
      const tecnicoMasCercano = tecnicos.reduce((cercano, actual) => {
        const distActual = calcularDistanciaKm(lat, lon, actual.lat, actual.lon);
        const distCercano = calcularDistanciaKm(lat, lon, cercano.lat, cercano.lon);
        return distActual < distCercano ? actual : cercano;
      });

      // Insertar cliente
      const { error: errorInsert } = await supabase.from('clientes').insert([
        {
          nombre,
          direccion,
          lat,
          lon,
          estado: 'pendiente',
          tecnico_asignado: tecnicoMasCercano.id,
        },
      ]);

      if (errorInsert) throw errorInsert;

      // Actualizar estado del técnico a "ocupado"
      await supabase.from('tecnicos').update({ estado: 'ocupado' }).eq('id', tecnicoMasCercano.id);

      alert(`Cliente creado y asignado a ${tecnicoMasCercano.nombre}`);
      setForm({ nombre: '', direccion: '' });
      onAgregado();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-6">
      <h2 className="text-lg font-semibold">Agregar Cliente</h2>
      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre del cliente"
        className="input w-full"
        required
      />
      <input
        name="direccion"
        value={form.direccion}
        onChange={handleChange}
        placeholder="Dirección (ej. Av. O’Higgins 123, Concepción)"
        className="input w-full"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={cargando}
      >
        {cargando ? 'Procesando...' : 'Agregar Cliente'}
      </button>
    </form>
  );
}
