import type { ReactNode } from "react";
import { BottomNav } from "../ui/BottomNav";
import { PlayerBarMobile } from "../ui/PlayerBarMobile";

export const DashboardMobileLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen  bg-[#121212] text-white">
      
      {/* 1. CONTENIDO PRINCIPAL (Ocupa todo el espacio de arriba) */}
      <main className="flex-1  pb-30">
        {children}
      </main>

      {/* 2. MINI REPRODUCTOR FLOTANTE */}
      <div className="fixed bottom-[60px] w-full h-[60px] bg-neutral-900 border-b border-neutral-800">
        {/* Play/Pause móvil */}
        <PlayerBarMobile/>
      </div>

      {/* 3. BARRA DE NAVEGACIÓN INFERIOR (Para los pulgares) */}
      <nav className="fixed bottom-0 w-full h-[60px] bg-black flex justify-around items-center border-t border-gray-800">
          <BottomNav />
      </nav>

    </div>
  );
};