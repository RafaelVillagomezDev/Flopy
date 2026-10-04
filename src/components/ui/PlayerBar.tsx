import React from 'react';
import {
  requestSeek,
  togglePlay,
  playNextTrack,
  playPreviousTrack,
} from '@/modules/player/player.slice';
import { ControlPlayer } from './ControlPlayer';
import { PlayerOptions } from './PlayerOptions';
import { ProgressTrackBar } from './ProgressTrackBar';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';

export const PlayerBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isPlaying, currentTime, duration, currentTrack } = useAppSelector(
    (state) => state.player
  );

  const currentToAlbum = currentTrack?.collectionId
    ? `/album/${currentTrack.collectionId}`
    : undefined;

  const handleSeek = (percentage: number) => {
    if (duration > 0) {
      dispatch(requestSeek((percentage / 100) * duration));
    }
  };

  return (
    <div className="flex items-center justify-between w-full h-full">
      <ControlPlayer
        isPlaying={isPlaying}
        onPlayToggle={() => dispatch(togglePlay())}
        onNext={() => dispatch(playNextTrack())}
        onPrev={() => dispatch(playPreviousTrack())}
      />
      <ProgressTrackBar
        srcImage={currentTrack?.artworkUrl100 || ''}
        trackName={currentTrack?.trackName || 'Sin reproducción'}
        currentTrackMinutes={currentTime}
        trackDurationMinutes={duration}
        onSeek={handleSeek}
        toAlbum={currentToAlbum}
      />
      <PlayerOptions />
    </div>
  );
};