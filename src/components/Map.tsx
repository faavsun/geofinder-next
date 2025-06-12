'use client';
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface Tecnico {
  nombre: string;
  especialidad: string;
  estado: string;
  lat: number;
  lon: number;
  eta?: number;
  tiempoTrabajoMin?: number;
  etaTotal?: number;
}

interface MapProps {
  tecnicos: Tecnico[];
}

export type MapHandle = {
  centrarEnTecnico: (nombre: string) => void;
};

const Map = forwardRef<MapHandle, MapProps>(({ tecnicos }, ref) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
  if (typeof window === 'undefined') return;
  // Si ya hay un mapa montado, elimínalo antes de volver a crear
  if (mapRef.current) {
    mapRef.current.remove();
    mapRef.current = null;
  }

  const map = L.map('map').setView([-36.82, -73.05], 13);
  mapRef.current = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  tecnicos.forEach((tecnico) => {
    const icono = L.icon({
      iconUrl: '/icons/tecnico.png',
      iconSize: [30, 30],
    });

    const marker = L.marker([tecnico.lat, tecnico.lon], { icon: icono })
      .addTo(map)
      .bindPopup(
        `<strong>${tecnico.nombre}</strong><br>${tecnico.especialidad}<br>ETA: ${tecnico.eta} min`
      );

    markerRefs.current[tecnico.nombre] = marker;
  });
  }, [tecnicos]);

  useImperativeHandle(ref, () => ({
    centrarEnTecnico: (nombre: string) => {
      const marker = markerRefs.current[nombre];
      if (marker && mapRef.current) {
        mapRef.current.setView(marker.getLatLng(), 15);
        marker.openPopup();
      }
    },
  }));

  return <div id="map" className="w-full h-[500px] rounded-md shadow" />;
});

export default Map;
