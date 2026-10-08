import { type ReactNode, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";
import { IconBase } from "../ui/IconBase";

interface NavHistoryProps {
  className?: string;
  size?: number;
  color?: string;
  iconPrev?: LucideIcon;
  iconNext?: LucideIcon;
  children?: ReactNode;
}

export const NavHistory: React.FC<NavHistoryProps> = ({
  className,
  size = 25,
  color,
  iconPrev: IconPrev = ChevronLeft,
  iconNext: IconNext = ChevronRight,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  
  const maxIdxRef = useRef<number>(0);

  useEffect(() => {
    const currentIdx = window.history.state?.idx;

    if (typeof currentIdx === "number") {
      // Si navegamos a una ruta nueva hacia adelante, actualizamos el tope máximo
      if (currentIdx > maxIdxRef.current) {
        maxIdxRef.current = currentIdx;
      }

      setCanGoBack(currentIdx > 0);
      setCanGoForward(currentIdx < maxIdxRef.current);
    } else {
      // Fallback si no hay idx de React Router
      setCanGoBack(window.history.length > 1);
      setCanGoForward(false);
    }
  }, [location]);

  return (
    <nav
      aria-label="Navegación en el historial"
      className={cn("flex w-full items-center justify-between gap-2", className)}
    >
      
      <div className="flex items-center min-w-[32px]">
        {canGoBack && (
          <button
            type="button"
            aria-label="Ir hacia atrás"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center p-1.5 transition-colors hover:opacity-80 cursor-pointer"
          >
            <IconBase icon={IconPrev} size={size} color={color} />
          </button>
        )}
      </div>

      {/* Contenido intermedio */}
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}

     
      <div className="flex items-center min-w-[32px] justify-end">
        {canGoForward && (
          <button
            type="button"
            aria-label="Ir hacia adelante"
            onClick={() => navigate(1)}
            className="inline-flex items-center justify-center p-1.5 transition-colors hover:opacity-80 cursor-pointer"
          >
            <IconBase icon={IconNext} size={size} color={color} />
          </button>
        )}
      </div>
    </nav>
  );
};