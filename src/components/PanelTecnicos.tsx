'use client';
import { Tecnico, Cliente } from './Map'; // Asegúrate de que Cliente esté importado
import Link from 'next/link';

interface Props {
  tecnicos: Tecnico[];
  clientes: Cliente[];
  onCentrar: (nombre: string) => void;
}

export default function PanelTecnicos({ tecnicos, clientes, onCentrar }: Props) {
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

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-700">Técnicos disponibles</h2>

      {tecnicos.map((tecnico) => {
        const slug = slugify(tecnico.nombre);
        const tieneClientes = clientes.some(c => c.tecnico_asignado === tecnico.id && c.estado !== 'finalizado');

        return (
          <Link
            key={tecnico.id}
            href={`/tecnicos/${slug}`}
            passHref
          >
            <div
              className="bg-white rounded-2xl shadow p-4 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={(e) => {
                e.stopPropagation();
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

              {tieneClientes && (
                <p className="text-sm text-gray-500 mt-1">
                  ETA desplazamiento: {tecnico.eta} min<br />
                  Tiempo de trabajo: {tecnico.tiempoTrabajoMin} min<br />
                  <strong>ETA total: {tecnico.etaTotal} min</strong>
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
