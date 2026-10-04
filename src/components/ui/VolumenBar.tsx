import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Volume2, Volume1, VolumeX, Icon } from 'lucide-react';
import type { RootState, AppDispatch } from '@/store/store';
import { setVolume, toggleMute } from '@modules/player/player.slice';
import { IconBase } from './IconBase';

export const VolumenBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { volume, isMuted } = useSelector((state: RootState) => state.player);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseFloat(e.target.value);
    dispatch(setVolume(rawValue / 100));
  };

  const handleMuteClick = () => {
    dispatch(toggleMute());
  };

  // Icono reactivo según el nivel y estado de silencio
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const sliderValue = isMuted ? 0 : Math.round(volume * 100);

  return (
    <div className={`flex items-center gap-2.5 w-full ${className}`}>
      <button
        type="button"
        onClick={handleMuteClick}
        className="text-neutral-400 hover:text-white transition-colors shrink-0 p-1"
        aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
      >
        <IconBase icon={VolumeIcon} size={18} color="white" />
      </button>

      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={sliderValue}
        onChange={handleVolumeChange}
        aria-label="Control de volumen"
        className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer
          accent-brand-red
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-3.5
          [&::-webkit-slider-thumb]:w-3.5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-brand-red
          [&::-moz-range-thumb]:h-3.5
          [&::-moz-range-thumb]:w-3.5
          [&::-moz-range-thumb]:border-none
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-brand-red"
      />
    </div>
  );
};