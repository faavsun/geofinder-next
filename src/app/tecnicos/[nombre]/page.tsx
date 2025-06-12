'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import tecnicos from '@/data/tecnicos.json';
import { MapPin } from 'lucide-react';

const puntoReferencia = { lat: -36.83, lon: -73.06 };
const velocidadKmh = 30;

function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD') // Elimina tildes
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

export default function PerfilTecnicoPage() {
  const { nombre } = useParams();
  const [tab, setTab] = useState<'resumen' | 'historial' | 'estadisticas'>('resumen');

  const tecnicoOriginal = tecnicos.find(
    (t) => slugify(t.nombre) === (nombre as string)
  );

  if (!tecnicoOriginal) {
    return <div className="p-6 text-red-600">Técnico no encontrado</div>;
  }

  const distancia = calcularDistanciaKm(
    tecnicoOriginal.lat,
    tecnicoOriginal.lon,
    puntoReferencia.lat,
    puntoReferencia.lon
  );
  const eta = Math.max(6, Math.round((distancia / velocidadKmh) * 60));
  const tiempoTrabajoMin = 15;
  const etaTotal = eta + tiempoTrabajoMin;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <a href="/panel-tecnicos" className="text-sm text-gray-600 hover:underline">← Volver al mapa</a>

        <div className="bg-white shadow-md rounded-xl p-6 mt-4 flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{tecnicoOriginal.nombre}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                {tecnicoOriginal.estado}
              </span>
              <span>203 servicios completados</span>
              <span>Miembro desde 19/8/2021</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mt-6 gap-4 border-b pb-2 text-sm font-medium text-gray-500">
          {['resumen', 'historial', 'estadisticas'].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item as any)}
              className={`capitalize pb-1 ${tab === item ? 'text-black border-b-2 border-black' : ''}`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Contenido del tab */}
        {tab === 'resumen' && (
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-lg mb-4">Información General</h2>
              <div className="text-sm space-y-2 text-gray-700">
                <p><strong>Especialidad:</strong> {tecnicoOriginal.especialidad}</p>
                <p><strong>Servicios completados:</strong> 203</p>
                <p><strong>ETA desplazamiento:</strong> {eta} min</p>
                <p><strong>Tiempo de trabajo estimado:</strong> {tiempoTrabajoMin} min</p>
                <p className="text-blue-700 font-bold text-base">ETA total: {etaTotal} min</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'historial' && (
          <div className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="font-semibold text-lg mb-2">Historial de Servicios</h2>
            <p className="text-sm text-gray-500 mb-4">
              Todos los servicios realizados por {tecnicoOriginal.nombre}
            </p>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-4 rounded-md border flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full mr-2">
                      {tecnicoOriginal.especialidad}
                    </span>
                    <span className="text-xs text-gray-500">5/1/2024</span>
                    <h3 className="font-medium text-gray-800">Servicio #{i + 1}</h3>
                    <p className="text-sm text-gray-600">Revisión de instalación</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                      <MapPin size={12} /> Local X · Duración: 30 min
                    </p>
                  </div>
                  <span className="text-blue-600 font-semibold text-sm">30 min</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'estadisticas' && (
          <div className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="font-semibold text-lg mb-4">Estadísticas</h2>
            <p>Distribución de tiempos, horas trabajadas y más.</p>
          </div>
        )}
      </div>
    </main>
  );
}
