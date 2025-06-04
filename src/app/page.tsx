'use client';
import { useRef } from 'react';
import tecnicosOriginales from '@/data/tecnicos.json';
import Map, { MapHandle, Tecnico } from '../components/Map';
import PanelTecnicos from '../components/PanelTecnicos';

// Asegura que todos los técnicos tengan 'eta' incluso si el JSON no lo trae
const tecnicosConETA: Tecnico[] = tecnicosOriginales.map((t) => ({
  ...t,
  eta: t.eta ?? Math.floor(Math.random() * 10) + 5,
}));

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
