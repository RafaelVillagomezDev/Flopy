import { Sidebar } from '@components/ui/Sidebar';
import type { ReactNode } from 'react';
import { PlayerBar } from '@components/ui/PlayerBar'; 

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="grid h-screen
            grid-cols-[80px_1fr] md:grid-cols-[180px_1fr] lg:grid-cols-[240px_1fr_300px] 
            grid-rows-[1fr_90px] overflow-hidden bg-[#121212] text-white font-sans"
        >

            {/* PANEL IZQUIERDO: Reducido en tablet (pading menor para que quepa bien) */}
            <aside className="col-start-1 row-start-1 overflow-y-auto bg-black p-3 md:p-4 border-r border-gray-800 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                <h2 className="text-lg md:text-xl font-bold mb-6 text-center md:text-left">Flopy</h2>
                <Sidebar />
            </aside>

            {/* CONTENIDO CENTRAL: Ahora tiene mucho más espacio horizontal */}
            <main className="col-start-2 row-start-1 overflow-y-auto bg-[#181818] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                {children}
            </main>

            {/* PANEL DERECHO: Oculto en tablets para maximizar el centro; reaparece en desktop (lg) */}
            <aside className="hidden lg:block lg:col-start-3 row-start-1 overflow-y-auto bg-black p-4 border-l border-gray-800">
                <h2 className="font-bold mb-4">Top Streams</h2>
                {/* Componente de listas derecha */}
            </aside>

            {/* REPRODUCTOR INFERIOR: Ocupa todo el ancho inferior dinámicamente */}
            <aside className="col-span-full row-start-2 bg-[#282828] border-t border-gray-800 z-10">
                <PlayerBar/>
            </aside>

        </div>
    );
};