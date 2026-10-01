import type React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { ButtonIcon } from '@/components/ui/ButtonIcon';

interface ControlPlayerProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
}

export const ControlPlayer: React.FC<ControlPlayerProps> = ({
  isPlaying,
  onPlayToggle,
  onNext,
  onPrev,
}) => {
  return (
    <div className="flex items-center justify-center gap-3 w-full px-4 py-2">
      <ButtonIcon
        icon={SkipBack}
        onClick={onPrev}
        aria-label="Pista anterior"
        className="bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-white"
      />
      <ButtonIcon
        icon={isPlaying ? Pause : Play}
        onClick={onPlayToggle}
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
      />
      <ButtonIcon
        icon={SkipForward}
        onClick={onNext}
        aria-label="Siguiente pista"
        className="bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-white"
      />
    </div>
  );
};