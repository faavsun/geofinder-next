'use client';
import { Tecnico } from './Map';
import Link from 'next/link';

interface Props {
  tecnicos: Tecnico[];
  onCentrar: (nombre: string) => void;
}

export default function PanelTecnicos({ tecnicos, onCentrar }: Props) {
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'disponible':
        return 'text-green-600';
      case 'ocupado':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-700">Técnicos disponibles</h2>

      {tecnicos.map((tecnico) => (
        <Link
          key={tecnico.id}
          href={`/tecnicos/${tecnico.slug}`}
          passHref
        >
          <div
            className="bg-white rounded-2xl shadow p-4 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={(e) => {
              e.stopPropagation(); // evitar doble click si hay navegación y centrado
              onCentrar(tecnico.nombre);
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg">{tecnico.nombre}</h3>
            </div>

            <p className="text-gray-600">{tecnico.especialidad}</p>

            <p className={`font-medium ${getEstadoColor(tecnico.estado)}`}>
              {tecnico.estado.charAt(0).toUpperCase() + tecnico.estado.slice(1)}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              ETA desplazamiento: {tecnico.eta} min<br />
              Tiempo de trabajo: {tecnico.tiempoTrabajoMin} min<br />
              <strong>ETA total: {tecnico.etaTotal} min</strong>
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
