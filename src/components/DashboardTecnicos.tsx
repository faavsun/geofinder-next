'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/lib/useUser';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

type PieItem = { name: string; value: number };
type BarServicios = { nombre: string; servicios: number };
type BarTiempos = { nombre: string; tiempo: number };

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

export default function DashboardTecnicos() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [especialidades, setEspecialidades] = useState<PieItem[]>([]);
  const [disponibilidad, setDisponibilidad] = useState<PieItem[]>([]);
  const [mejoresTecnicos, setMejoresTecnicos] = useState<BarServicios[]>([]);
  const [tiemposPromedio, setTiemposPromedio] = useState<BarTiempos[]>([]);

  // 🔒 Protección de ruta
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: tecnicosRaw } = await supabase
        .from('tecnicos')
        .select('id, nombre, especialidad, estado, tiempo_trabajo, rol');
      const { data: clientes } = await supabase
        .from('clientes')
        .select('estado, tecnico_asignado');

      const tecnicos = (tecnicosRaw || []).filter(t => t.rol !== 'supervisor');

      const especialidadMap = new Map<string, number>();
      tecnicos.forEach(t => {
        especialidadMap.set(t.especialidad, (especialidadMap.get(t.especialidad) || 0) + 1);
      });
      setEspecialidades(Array.from(especialidadMap.entries()).map(([name, value]) => ({ name, value })));

      const disponibles = tecnicos.filter(t => t.estado === 'disponible').length;
      const ocupados = tecnicos.filter(t => t.estado === 'ocupado').length;
      setDisponibilidad([
        { name: 'Disponible', value: disponibles },
        { name: 'Ocupado', value: ocupados }
      ]);

      const conteoPorTecnico = new Map<string, number>();
      clientes?.forEach(c => {
        if (c.estado === 'finalizado') {
          conteoPorTecnico.set(c.tecnico_asignado, (conteoPorTecnico.get(c.tecnico_asignado) || 0) + 1);
        }
      });

      setMejoresTecnicos(tecnicos.map(t => ({
        nombre: t.nombre,
        servicios: conteoPorTecnico.get(t.id) || 0
      })));

      setTiemposPromedio(tecnicos.map(t => ({
        nombre: t.nombre,
        tiempo: t.tiempo_trabajo || 0
      })));
    };

    if (user) cargarDatos();
  }, [user]);

  if (loading) return <p className="p-6">Cargando sesión...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Distribución por Servicio */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-1">Distribución por Servicio</h2>
        <p className="text-sm text-gray-500 mb-4">Cantidad de técnicos por especialidad</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={especialidades} dataKey="value" nameKey="name" outerRadius={70}>
              {especialidades.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Estado de Disponibilidad */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-1">Estado de Disponibilidad</h2>
        <p className="text-sm text-gray-500 mb-4">Técnicos disponibles vs ocupados</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={disponibilidad} dataKey="value" nameKey="name" outerRadius={70}>
              {disponibilidad.map((_, index) => (
                <Cell key={`cell-disp-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Mejores Técnicos */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-1">Mejores Técnicos</h2>
        <p className="text-sm text-gray-500 mb-4">Por servicios completados</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={[...mejoresTecnicos].sort((a, b) => b.servicios - a.servicios)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="servicios" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tiempo Promedio de Servicio */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-1">Tiempo Promedio de Servicio</h2>
        <p className="text-sm text-gray-500 mb-4">En minutos por técnico</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={[...tiemposPromedio].sort((a, b) => b.tiempo - a.tiempo)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tiempo" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
