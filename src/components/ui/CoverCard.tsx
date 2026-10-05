import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/utils/cn";

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

  return (
    <div className="w-full max-w-xs">
      <p className="text-sm font-semibold truncate sm:text-lg mb-1">{textSong}</p>

      <div className="w-full mt-3 aspect-square rounded-lg overflow-hidden bg-neutral-800 flex items-center justify-center border border-neutral-700">
        {hasValidImage ? (
          <img
            src={imageCover}
            alt={textSinger}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
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
      </div>

      <p className="text-xs text-neutral-400 truncate mt-4">{textSinger}</p>

      <div className={cn("w-full flex items-center justify-between mt-2", className)}>
        {children}
      </div>
    </div>
  );
};