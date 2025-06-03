// components/PanelTecnicos.tsx
export default function PanelTecnicos() {
  const tecnicos = [
    {
      id: 1,
      nombre: "Carlos Mendoza",
      especialidad: "Instalación",
      estado: "disponible",
      eta: "12 min",
    },
    {
      id: 2,
      nombre: "Ana García",
      especialidad: "Soporte",
      estado: "disponible",
      eta: "18 min",
    },
    {
      id: 3,
      nombre: "Laura Ruiz",
      especialidad: "Instalación",
      estado: "ocupado",
      eta: "28 min",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Técnicos disponibles</h2>
      <ul className="space-y-4">
        {tecnicos.map((tecnico) => (
          <li
            key={tecnico.id}
            className="p-4 border rounded-md hover:shadow transition bg-white"
          >
            <h3 className="font-semibold text-gray-800">{tecnico.nombre}</h3>
            <p className="text-sm text-gray-600">{tecnico.especialidad}</p>
            <p
              className={`text-sm font-medium mt-1 ${
                tecnico.estado === "disponible" ? "text-green-600" : "text-red-600"
              }`}
            >
              {tecnico.estado === "disponible" ? "Disponible" : "Ocupado"}
            </p>
            <p className="text-sm text-gray-500 mt-1">ETA: {tecnico.eta}</p>
            <div className="flex gap-2 mt-2">
              <button className="text-blue-600 text-sm hover:underline">Ver en mapa</button>
              <button className="text-gray-500 text-sm hover:underline">Contactar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
