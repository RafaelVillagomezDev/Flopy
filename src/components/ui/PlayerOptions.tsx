
import { Volume2, CircleEllipsis, Repeat, Shuffle ,VolumeOff  } from 'lucide-react';
import { VolumenBar } from './VolumenBar';
import { IconBase } from './IconBase';


export const PlayerOptions: React.FC = () => {

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
          <VolumenBar />
        </div>

        <button className="bg-neutral-800 text-white hover:bg-neutral-700 rounded-full p-2">
          <CircleEllipsis className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};