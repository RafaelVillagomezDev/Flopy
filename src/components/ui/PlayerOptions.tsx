import React from 'react';
import { CircleEllipsis, Repeat, Shuffle } from 'lucide-react';
import { VolumenBar } from './VolumenBar';

interface PlayerOptionsProps {
  randomSong: () => void;
  repeatAlbum?: () => void;
  isShuffle?: boolean
}

export const PlayerOptions: React.FC<PlayerOptionsProps> = ({
  randomSong,
  repeatAlbum,
  isShuffle
}) => {
  return (
    <div className="flex items-center justify-between w-full h-full px-4 py-2">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={repeatAlbum}
          aria-label="Repetir reproducción"
          className="bg-neutral-800 text-white hover:bg-neutral-700 transition-colors rounded-full p-2"
        >
          <Repeat className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={randomSong}
          aria-label="Reproducción aleatoria"
          className={`transition-colors rounded-full p-2  text-white ${isShuffle
              ? 'bg-brand-red-active ' 
              : 'bg-neutral-800' 
            }`}
        >
          <Shuffle className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <VolumenBar />
        </div>

        <button
          type="button"
          aria-label="Más opciones"
          className="bg-neutral-800 text-white hover:bg-neutral-700 transition-colors rounded-full p-2"
        >
          <CircleEllipsis className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};