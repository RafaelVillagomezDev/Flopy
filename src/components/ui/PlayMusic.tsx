import type React from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/utils/cn";

interface PlayMusicProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  className?: string; 
}

export const PlayMusic: React.FC<PlayMusicProps> = ({ 
  isPlaying, 
  onPlayToggle, 
  className 
}) => {
  return (
    <button
      onClick={onPlayToggle}
      className={cn(
        "flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full hover:scale-105 hover:bg-red-500 active:scale-95 transition-all duration-200 shadow-lg shadow-red-600/20",
        className
      )}
      aria-label={isPlaying ? "Pausar" : "Reproducir"}
      title={isPlaying ? "Pausar" : "Reproducir"}
    >
      {isPlaying ? (
        <Pause className="w-1/2 h-1/2 fill-current" />
      ) : (
        <Play className="w-1/2 h-1/2 fill-current ml-1" />
      )}
    </button>
  );
};