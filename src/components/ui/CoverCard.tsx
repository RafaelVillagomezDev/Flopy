import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { PlayMusic } from "./PlayMusic";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks"; 
import { togglePlay } from "@modules/player/player.slice"; 

interface CoverCardProps {
  textSong?: string;
  imageCover?: string;
  textSinger?: string;
  className?: string;
  children?: ReactNode;
}

export const CoverCard: React.FC<CoverCardProps> = ({
  textSong = "Sin título",
  imageCover,
  textSinger = "Sin artista",
  className,
  children,
}) => {
  const [hasError, setHasError] = useState(false);
  const hasValidImage = Boolean(imageCover && imageCover.trim() !== "" && !hasError);

  const dispatch = useAppDispatch();
  const { isPlaying, currentTrack } = useAppSelector(
    (state) => state.player
  );

  const handlePlayToggle = () => {
    dispatch(togglePlay()); 
  };


  const hasActiveTrack = Boolean(currentTrack || isPlaying);

  return (
    <div className="w-full max-w-xs">
      <p className="text-sm font-semibold truncate sm:text-lg mb-1">{textSong}</p>

      
      <div className="relative w-full mt-3 aspect-square rounded-lg overflow-hidden bg-neutral-800 flex items-center justify-center border border-neutral-700 shadow-md group">
        
        {hasValidImage ? (
          <img
            src={imageCover}
            alt={textSinger}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center text-neutral-400 select-none">
            <svg
              className="w-10 h-10 mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <span className="text-xs sm:text-sm font-medium">Sin portada</span>
          </div>
        )}

        {/* 
          BOTÓN SUPERPUESTO: 
          - sm:flex -> Solo se muestra en pantallas mayores de 'sm'
          - hasActiveTrack -> Solo se renderiza si hay música activa 
          - bg-black/40 -> Fondo oscurecido para resaltar el botón sobre portadas claras
        */}
        {hasActiveTrack && (
          <div className="hidden sm:flex absolute inset-0 bg-black/40 items-center justify-center transition-opacity duration-300 z-10">
            <PlayMusic 
              isPlaying={isPlaying} 
              onPlayToggle={handlePlayToggle} 
              className="w-16 h-16 shadow-xl" 
            />
          </div>
        )}
      </div>

      <p className="text-xs text-neutral-400 truncate mt-4">{textSinger}</p>

      <div className={cn("w-full flex flex-wrap items-center justify-between gap-4 mt-2", className)}>
        
        {/* 
          BOTÓN INFERIOR: 
          - Se oculta en 'sm' (sm:hidden) SOLO si el botón ya se está mostrando en el centro de la imagen 
        */}
        <div className={cn("shrink-0", hasActiveTrack ? "sm:hidden" : "block")}>
          <PlayMusic 
            isPlaying={isPlaying} 
            onPlayToggle={handlePlayToggle} 
            className="w-10 h-10" 
          />
        </div>
        
        {/* Renderizado de los demás controles o children que envíes desde el padre */}
        <div className="flex-1 flex justify-start">
          {children}
        </div>
      </div>
    </div>
  );
};