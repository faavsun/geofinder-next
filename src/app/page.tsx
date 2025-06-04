'use client';
import { useRef } from 'react';
import tecnicosOriginales from '@/data/tecnicos.json';
import Map, { MapHandle, Tecnico } from '../components/Map';
import PanelTecnicos from '../components/PanelTecnicos';

// Punto de referencia fijo
const puntoReferencia = { lat: -36.83, lon: -73.06 };

// Velocidad realista urbana en km/h
const velocidadKmh = 30;

// Fórmula de distancia (Haversine)
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

// Calcula ETA con mínimo visual
const tecnicosConETA: Tecnico[] = tecnicosOriginales.map((t) => {
  const distanciaKm = calcularDistanciaKm(t.lat, t.lon, puntoReferencia.lat, puntoReferencia.lon);
  const eta = Math.max(6, Math.round((distanciaKm / velocidadKmh) * 60)); // mínimo 6 minutos
  return { ...t, eta };
});


export default function PanelTecnicosPage() {
  const mapRef = useRef<MapHandle>(null);

  const handleCentrar = (nombre: string) => {
    mapRef.current?.centrarEnTecnico(nombre);
  };

  return (
    <main className="flex flex-col md:flex-row h-screen">
      <section className="w-full md:w-2/3 p-4">
        <h1 className="text-2xl font-bold mb-4">Panel de Técnicos</h1>
        <Map ref={mapRef} tecnicos={tecnicosConETA} />
      </section>

      <aside className="w-full md:w-1/3 bg-gray-100 p-4 overflow-y-auto">
        <PanelTecnicos tecnicos={tecnicosConETA} onCentrar={handleCentrar} />
      </aside>
    </main>
  );
}
