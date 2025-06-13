// src/lib/apiTecnicos.ts
import { supabase } from './supabase';
import { Tecnico } from '../components/Map';

export async function obtenerTecnicos(): Promise<Tecnico[]> {
  const { data, error } = await supabase
    .from('tecnicos')
    .select('nombre, especialidad, estado, lat, lon, tiempo_trabajo');

  if (error) {
    console.error('Error al obtener técnicos:', error.message);
    return [];
  }

  // Punto de referencia fijo
  const puntoReferencia = { lat: -36.83, lon: -73.06 };
  const velocidadKmh = 30;

  // Distancia (Haversine)
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

  return data.map((t) => {
    const distanciaKm = calcularDistanciaKm(t.lat, t.lon, puntoReferencia.lat, puntoReferencia.lon);
    const eta = Math.max(6, Math.round((distanciaKm / velocidadKmh) * 60));
    const etaTotal = eta + t.tiempo_trabajo;

    return {
      ...t,
      eta,
      tiempoTrabajoMin: t.tiempo_trabajo,
      etaTotal,
    };
  });
}
