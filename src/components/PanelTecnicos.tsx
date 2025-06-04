'use client';
import { Tecnico } from './Map';

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
        <div
          key={tecnico.nombre}
          className="bg-white rounded-2xl shadow p-4 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => onCentrar(tecnico.nombre)}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-lg">
              {tecnico.nombre}
            </h3>
          </div>
          <p className="text-gray-600">{tecnico.especialidad}</p>
          <p className={`font-medium ${getEstadoColor(tecnico.estado)}`}>
            {tecnico.estado.charAt(0).toUpperCase() + tecnico.estado.slice(1)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {tecnico.eta !== undefined ? `ETA: ${tecnico.eta} min` : 'ETA no disponible'}
          </p>
        </div>
      ))}
    </div>
  );
}
