import { Sidebar } from '@components/ui/Sidebar'; // Tu menú con componentes compuestos
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="grid h-screen grid-cols-[240px_1fr_300px] grid-rows-[1fr_90px] overflow-hidden bg-[#121212] text-white font-sans">

            {/* PANEL IZQUIERDO: Estático */}

            <aside className="col-start-1 row-start-1 overflow-y-auto bg-black p-4 border-r border-gray-800 [&::-webkit-scrollbar]:hidden">
                <h2 className="text-xl font-bold mb-6">Flopy</h2>
                <Sidebar />
            </aside>

            {/* CONTENIDO CENTRAL: Dinámico (Aquí entra la magia de {children}) */}
            <main className="col-start-2 row-start-1 overflow-y-auto bg-[#181818]">
                {children}
            </main>

            {/* PANEL DERECHO: Estático */}
            <aside className="col-start-3 row-start-1 overflow-y-auto bg-black p-4 border-l border-gray-800">
                <h2 className="font-bold mb-4">Top Streams</h2>
                {/* Componente de listas derecha */}
            </aside>

            {/* REPRODUCTOR INFERIOR: Estático */}
            <footer className="col-span-3 row-start-2 bg-[#282828] border-t border-gray-700 p-4 z-10">
                {/* Componente del reproductor */}
            </footer>

        </div>
    );
};