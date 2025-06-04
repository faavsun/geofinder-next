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

  // Punto de referencia fijo
  const puntoReferencia = { lat: -36.83, lon: -73.06 };

  useEffect(() => {
    mapRef.current = L.map('map').setView([-36.82, -73.05], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    // Marcador del punto de referencia
    const iconoReferencia = L.icon({
      iconUrl: '/icons/pin.png', // asegúrate de tener este ícono en public/icons
      iconSize: [30, 30],
    });

    L.marker([puntoReferencia.lat, puntoReferencia.lon], { icon: iconoReferencia })
      .addTo(mapRef.current)
      .bindPopup('<strong>Punto de referencia</strong><br>Ubicación objetivo');

    // Marcadores de técnicos
    tecnicos.forEach((tecnico) => {
      const icono = L.icon({
        iconUrl: '/icons/tecnico.png', // asegúrate de tener este ícono también
        iconSize: [30, 30],
      });

      const marker = L.marker([tecnico.lat, tecnico.lon], { icon: icono })
        .addTo(mapRef.current!)
        .bindPopup(
          `<strong>${tecnico.nombre}</strong><br>${tecnico.especialidad}` +
          (tecnico.eta !== undefined ? `<br>ETA: ${tecnico.eta} min` : '')
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
