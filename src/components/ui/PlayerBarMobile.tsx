import React from 'react';
import {
    requestSeek, togglePlay
} from '@/modules/player/player.slice';
import { ProgressTrackBar } from './ProgressTrackBar';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { PlayMusic } from './PlayMusic';

export const PlayerBarMobile: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isPlaying, currentTime, duration, currentTrack, isShuffle } = useAppSelector(
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
    const handlePlayToggle = () => {
        dispatch(togglePlay());
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
                className='rounded-none'
            />
            <PlayMusic isPlaying={isPlaying}
                onPlayToggle={handlePlayToggle} className='w-10 h-8 m-4' />
        </div>
    );
};