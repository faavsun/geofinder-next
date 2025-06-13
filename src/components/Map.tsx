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

export interface Cliente {
  id: number;
  nombre: string;
  direccion: string;
  lat: number;
  lon: number;
  estado: string;
  tecnico_asignado: string;
}

interface MapProps {
  tecnicos: Tecnico[];
  clientes: Cliente[];
}

export type MapHandle = {
  centrarEnTecnico: (nombre: string) => void;
};

const Map = forwardRef<MapHandle, MapProps>(({ tecnicos, clientes }, ref) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    const mapContainer = document.getElementById('map');
    if (!mapRef.current && mapContainer) {
      const map = L.map(mapContainer).setView([-36.82, -73.05], 13);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
    }

    // Limpiar marcadores anteriores
    Object.values(markerRefs.current).forEach((marker) => {
      if (mapRef.current?.hasLayer(marker)) {
        mapRef.current.removeLayer(marker);
      }
    });
    markerRefs.current = {};

    // Agregar marcadores de técnicos
    tecnicos.forEach((tecnico) => {
      const icono = L.icon({
        iconUrl: '/icons/tecnico.png',
        iconSize: [30, 30],
      });

      const marker = L.marker([tecnico.lat, tecnico.lon], { icon: icono })
        .addTo(mapRef.current!)
        .bindPopup(
          `<strong>${tecnico.nombre}</strong><br>${tecnico.especialidad}<br>ETA: ${tecnico.eta ?? '-'} min`
        );

      markerRefs.current[tecnico.nombre] = marker;
    });

    // Agregar marcadores de clientes
    clientes.forEach((cliente) => {
      const iconoCliente = L.icon({
        iconUrl: '/icons/cliente.png',
        iconSize: [25, 25],
      });

      if (cliente.lat && cliente.lon) {
        const marker = L.marker([cliente.lat, cliente.lon], { icon: iconoCliente })
          .addTo(mapRef.current!)
          .bindPopup(
            `<strong>${cliente.nombre}</strong><br>${cliente.direccion}<br>Estado: ${cliente.estado}`
          );

        markerRefs.current[`cliente-${cliente.id}`] = marker;
      } else {
        console.warn(`⚠️ Cliente sin coordenadas válidas: ${cliente.nombre}`, cliente);
      }
    });

    console.log('🗺️ Clientes en el mapa:', clientes);
    clientes.forEach((c) =>
      console.log(`📍 ${c.nombre}: lat=${c.lat}, lon=${c.lon}`)
    );
  }, [tecnicos, clientes]);

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
