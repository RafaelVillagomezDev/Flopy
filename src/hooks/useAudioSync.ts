// hooks/useAudioSync.ts
import { useRef, useEffect } from 'react';
import type { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  setTimeUpdate,
  setIsPlaying,
  resetSeek,
} from '@/modules/player/player.slice';


export const useAudioSync = () => {
  const dispatch = useAppDispatch();
  const mediaRef = useRef<HTMLVideoElement>(null);

  const { currentTrack, isPlaying, isMuted, seekTime, volume } = useAppSelector(
    (state: RootState) => state.player
  );

  // Play / Pause
  useEffect(() => {
    const media = mediaRef.current;
    if (!media || !currentTrack) return;

    if (isPlaying) {
      media.play().catch((err) => {
        console.warn('Reproducción bloqueada o interrumpida:', err);
        dispatch(setIsPlaying(false));
      });
    } else {
      media.pause();
    }
  }, [isPlaying, currentTrack, dispatch]);

  // Mute y Volumen
  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.muted = isMuted;
      mediaRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  // Seek
  useEffect(() => {
    if (mediaRef.current && seekTime !== null) {
      mediaRef.current.currentTime = seekTime;
      dispatch(resetSeek());
    }
  }, [seekTime, dispatch]);

  // Handlers para las props del elemento multimedia
  const mediaHandlers = {
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement>) => {
      dispatch(
        setTimeUpdate({
          currentTime: 0,
          duration: e.currentTarget.duration || 0,
        })
      );
    },
    onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const media = e.currentTarget;
      dispatch(
        setTimeUpdate({
          currentTime: media.currentTime,
          duration: media.duration || 0,
        })
      );
    },
    onEnded: () => dispatch(setIsPlaying(false)),
  };

  return { mediaRef, currentTrack, mediaHandlers };
};