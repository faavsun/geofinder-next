import Map from '../components/Map';
import PanelTecnicos from '../components/PanelTecnicos';

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row h-screen">
      <section className="w-full md:w-2/3 p-4">
        <h1 className="text-2xl font-bold mb-4">Panel de Técnicos</h1>
        <Map />
      </section>

      <aside className="w-full md:w-1/3 bg-gray-100 p-4 overflow-y-auto">
        <PanelTecnicos />
      </aside>
    </main>
  );
}
