import { type TrackItem } from '@/types/track.type';
import { Pause, Play } from 'lucide-react';
import { IconBase } from './IconBase';

interface ListTracksProps {
    tracks: TrackItem[];
    onTrackSelect: (track: TrackItem) => void;
    currentTrack: TrackItem | null;
    isPlaying: boolean;
    duration?: number;
}

export const ListTracks: React.FC<ListTracksProps> = ({
    tracks,
    onTrackSelect,
    currentTrack,
    isPlaying,
    duration = 0,
}) => {
    const formatDuration = (durationInSeconds: number): string => {
        if (!durationInSeconds || isNaN(durationInSeconds) || durationInSeconds < 0) {
            return '0:00.00';
        }

        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        const milliseconds = Math.floor((durationInSeconds % 1) * 100);

        const formattedMinutes = minutes.toString();
        const formattedSeconds = seconds.toString().padStart(2, '0');
        const formattedMs = milliseconds.toString().padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}.${formattedMs}`;
    };

    return (
        <div className="flex flex-col gap-1 mt-3 ">
            {tracks?.map((track, index) => {
                const isCurrent = currentTrack?.trackId === track.trackId;
                const isThisPlaying = isCurrent && isPlaying;

                return (
                    <div
                        key={track.trackId}
                        onClick={() => onTrackSelect(track)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onTrackSelect(track);
                            }
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200  cursor-pointer select-none ${
                            isCurrent
                                ? 'bg-card-bg-active border-card-border-active text-card-text-active'
                                : 'border-transparent hover:border-card-border-hover hover:bg-card-bg-hover text-card-text-primary'
                        }`}
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <span className="text-card-text-muted w-6 text-right text-sm shrink-0">
                                {index + 1}
                            </span>
                            <div className="truncate">
                                <p className="font-medium text-sm truncate">{track.trackName}</p>
                                <p className="text-xs text-card-text-muted truncate">{track.artistName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-xs text-card-text-muted shrink-0 tabular-nums">
                                {isCurrent ? formatDuration(duration) : '0:30.00'}
                            </span>

                            <button
                                type="button"
                                role="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTrackSelect(track);
                                }}
                                className={`p-2.5 rounded-full transition-all shrink-0 cursor-pointer ${
                                    isThisPlaying
                                        ? 'bg-card-text-active text-black'
                                        : 'bg-neutral-800 text-white hover:bg-emerald-500 hover:text-black'
                                }`}
                                aria-label={isThisPlaying ? 'Pausar' : 'Reproducir'}
                            >
                                <IconBase
                                    icon={isThisPlaying ? Pause : Play}
                                    size={16}
                                    color={isThisPlaying ? 'black' : 'white'}
                                />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};