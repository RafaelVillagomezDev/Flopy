
import { Volume2, CircleEllipsis, Repeat, Shuffle ,VolumeOff  } from 'lucide-react';
import { VolumenBar } from './VolumenBar';
import { useState } from 'react';
import { IconBase } from './IconBase';


interface PlayerOptionsProps {
    isMuted?: boolean;
    onMuteToggle?: () => void;
}

export const PlayerOptions: React.FC<PlayerOptionsProps> = ({ isMuted, onMuteToggle }) => {

  return (
    <div className="flex items-center justify-between w-full h-full px-4 py-2">
      <div className="flex items-center gap-4">
        <button className="bg-neutral-800 text-white hover:bg-neutral-700 rounded-full p-2">
          <Repeat className="w-4 h-4" />
        </button>
        <button className="bg-neutral-800 text-white hover:bg-neutral-700 rounded-full p-2">
          <Shuffle className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex  items-center gap-2">
          <button className="bg-neutral-800 text-white hover:bg-neutral-700 rounded-full p-2" onClick={onMuteToggle}>
            <IconBase icon={isMuted ? VolumeOff : Volume2} size={16} color="white" />
          </button>
          <VolumenBar />
        </div>

        <button className="bg-neutral-800 text-white hover:bg-neutral-700 rounded-full p-2">
          <CircleEllipsis className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};