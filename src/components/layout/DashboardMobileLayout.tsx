import type { ReactNode } from "react";
import { BottomNav } from "../ui/BottomNav";
export const DashboardMobileLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-full sm:h-screen  bg-[#121212] text-white">
      
      {/* 1. CONTENIDO PRINCIPAL (Ocupa todo el espacio de arriba) */}
      <main className="flex-1  pb-24">
        {children}
      </main>

      {/* 2. MINI REPRODUCTOR FLOTANTE */}
      <div className="fixed bottom-[60px] w-full h-[60px] bg-[#282828] border-b border-gray-900">
        {/* Play/Pause móvil */}
      </div>

      {/* 3. BARRA DE NAVEGACIÓN INFERIOR (Para los pulgares) */}
      <nav className="fixed bottom-0 w-full h-[60px] bg-black flex justify-around items-center border-t border-gray-800">
          <BottomNav />
      </nav>

    </div>
  );
};