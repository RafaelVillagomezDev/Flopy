import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Loader2 } from 'lucide-react';
import {
    fetchAlbumTracks,
    setCurrentTrack,
    togglePlay,
} from '@modules/player/player.slice';
import type { TrackItem } from '@/types/track.type';

import { ListTracks } from '@/components/ui/ListTracks';
import { AlbumCardHead } from '@/components/ui/AlbumCardHead';
import { Loader } from '@/components/ui/Loader';
import { useAppDispatch } from '@/hooks/hooks';

export const Album: React.FC = () => {

    const { collectionId } = useParams<{ collectionId: string }>();

    const dispatch = useAppDispatch()

    const { albumTracks, currentTrack, isPlaying, loading, error, duration } = useSelector(
        (state: RootState) => state.player
    );



    useEffect(() => {
        if (collectionId) {
            const parsedId = Number(collectionId);

            if (!isNaN(parsedId)) {
                dispatch(fetchAlbumTracks(parsedId));
            }
        }
    }, [collectionId, dispatch]);

    const handlePlaySong = (track: TrackItem) => {
        if (currentTrack?.trackId === track.trackId) {
            dispatch(togglePlay());
        } else {
            dispatch(setCurrentTrack({
                track,
                queue: albumTracks || []
            }));
        }
    };

    if (loading) {
        return (
            <Loader icon={Loader2} >
                <span className='text-white'>Cargando</span>
            </Loader>
        )
    }

    if (error) {
        return <div className="p-6 text-red-400">Error: {error}</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Cabecera del Álbum (usando los datos de la primera pista o del store) */}
            {albumTracks && albumTracks.length > 0 && (
                <AlbumCardHead
                    album={albumTracks}
                    navTo={`/singer/${encodeURIComponent(albumTracks[0].artistName)}`}
                />
            )}

            {/* Lista de canciones */}

            <ListTracks
                tracks={albumTracks || []}
                onTrackSelect={handlePlaySong}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                duration={duration || 0}
            />
        </div>
    );
}


