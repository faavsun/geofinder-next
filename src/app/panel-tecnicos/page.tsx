"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";

type Tecnico = {
  id: number;
  nombre: string;
  especialidad: string;
  estado: "disponible" | "ocupado";
  lat: number;
  lon: number;
};

const tecnicos: Tecnico[] = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    especialidad: "Instalación",
    estado: "disponible",
    lat: -36.822,
    lon: -73.044,
  },
  {
    id: 2,
    nombre: "Ana García",
    especialidad: "Soporte",
    estado: "disponible",
    lat: -36.823,
    lon: -73.046,
  },
  {
    id: 3,
    nombre: "Laura Ruiz",
    especialidad: "Instalación",
    estado: "ocupado",
    lat: -36.826,
    lon: -73.049,
  },
];

export default function PanelTecnicos() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([-36.82, -73.05], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    tecnicos.forEach((tecnico) => {
      L.marker([tecnico.lat, tecnico.lon])
        .addTo(map)
        .bindPopup(`${tecnico.nombre} - ${tecnico.especialidad}`);
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="w-full lg:w-3/4 h-[500px] lg:h-screen">
        <div ref={mapRef} className="w-full h-full z-0 rounded-lg shadow-md" />
      </div>

      <aside className="w-full lg:w-1/4 bg-white shadow-lg border-l p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Técnicos disponibles</h2>
        <ul className="space-y-4">
          {tecnicos.map((tecnico) => (
            <li key={tecnico.id} className="p-4 border rounded-md hover:shadow transition bg-gray-50">
              <h3 className="font-semibold text-gray-800">{tecnico.nombre}</h3>
              <p className="text-sm text-gray-600">{tecnico.especialidad}</p>
              <p
                className={`text-sm font-medium mt-1 ${
                  tecnico.estado === "disponible" ? "text-green-600" : "text-red-600"
                }`}
              >
                {tecnico.estado === "disponible" ? "Disponible" : "Ocupado"}
              </p>
              <p className="text-sm text-gray-500 mt-1">ETA: 12 min</p>
              <div className="flex gap-2 mt-2">
                <button className="text-blue-600 text-sm hover:underline">Ver en mapa</button>
                <button className="text-gray-500 text-sm hover:underline">Contactar</button>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
