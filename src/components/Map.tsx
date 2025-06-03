'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define la interfaz del técnico
interface Tecnico {
  nombre: string;
  especialidad: string;
  estado: string;
  lat: number;
  lon: number;
  eta: number;
}

export default function Map() {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>({});

  // 1. Inicializa el mapa solo una vez
  useEffect(() => {
    const map = L.map('map').setView([-36.82, -73.05], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
  }, []);

  // 2. Carga técnicos desde archivo JSON en /public/data
  useEffect(() => {
    const fetchTecnicos = async () => {
      const res = await fetch('/data/tecnicos.json');
      const tecnicos: Tecnico[] = await res.json();

      tecnicos.forEach((tecnico) => {
        const icono = L.icon({
          iconUrl: '/icons/tecnico.png', // asegúrate de tener este ícono en /public/icons/
          iconSize: [30, 30],
        });

        const marker = L.marker([tecnico.lat, tecnico.lon], { icon: icono }).addTo(mapRef.current!);
        marker.bindPopup(`<strong>${tecnico.nombre}</strong><br>${tecnico.especialidad}<br>ETA: ${tecnico.eta} min`);
        markerRefs.current[tecnico.nombre] = marker;
      });
    };

    fetchTecnicos();
  }, []);

  // 3. Permite centrar técnico desde otro componente (provisional)
  useEffect(() => {
    if (!mapRef.current) return;

    (window as any).centrarTecnico = (nombre: string) => {
      const marker = markerRefs.current[nombre];
      if (marker) {
        mapRef.current!.setView(marker.getLatLng(), 15);
        marker.openPopup();
      }
    };
  }, []);

  return (
    <div id="map" className="w-full h-[500px] rounded-md shadow" />
  );
}
