import React from 'react';
import {
  requestSeek,
  togglePlay,
  playNextTrack,
  playPreviousTrack,
} from '@/modules/player/player.slice';
import { ControlPlayer } from './ControlPlayer';
import { ProgressTrackBar } from './ProgressTrackBar';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';

export const PlayerBarMobile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isPlaying, currentTime, duration, currentTrack ,isShuffle } = useAppSelector(
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
      
      <ProgressTrackBar
        srcImage={currentTrack?.artworkUrl100 || ''}
        trackName={currentTrack?.trackName || 'Sin reproducción'}
        currentTrackMinutes={currentTime}
        trackDurationMinutes={duration}
        onSeek={handleSeek}
        toAlbum={currentToAlbum}
      />
      <ControlPlayer
        isPlaying={isPlaying}
        onPlayToggle={() => dispatch(togglePlay())}
        onNext={() => dispatch(playNextTrack())}
        onPrev={() => dispatch(playPreviousTrack())}
      />
    </div>
  );
};