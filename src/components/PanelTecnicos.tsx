'use client';
import { useState } from 'react';
import { Tecnico } from './Map';

interface Props {
  tecnicos: Tecnico[];
  onCentrar: (nombre: string) => void;
}

export default function PanelTecnicos({ tecnicos, onCentrar }: Props) {
  const [busqueda, setBusqueda] = useState('');

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

  const tecnicosFiltrados = tecnicos.filter((tecnico) =>
    `${tecnico.nombre} ${tecnico.especialidad}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-700">Técnicos disponibles</h2>

      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o especialidad"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
      />

      {tecnicosFiltrados.length === 0 ? (
        <p className="text-gray-500 text-sm">No se encontraron técnicos.</p>
      ) : (
        tecnicosFiltrados.map((tecnico) => (
          <div
            key={tecnico.nombre}
            className="bg-white rounded-2xl shadow p-4 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => onCentrar(tecnico.nombre)}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-lg">{tecnico.nombre}</h3>
            </div>
            <p className="text-gray-600">{tecnico.especialidad}</p>
            <p className={`font-medium ${getEstadoColor(tecnico.estado)}`}>
              {tecnico.estado.charAt(0).toUpperCase() + tecnico.estado.slice(1)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {tecnico.eta !== undefined ? `ETA: ${tecnico.eta} min` : 'ETA no disponible'}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
