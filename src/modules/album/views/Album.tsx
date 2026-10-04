import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { 
  fetchAlbumTracks, 
  setCurrentTrack, 
  togglePlay, 
  type TrackItem 
} from '@modules/player/player.slice';
import { Play, Pause } from 'lucide-react';

export const Album: React.FC = () => {
  
  const { collectionId } = useParams<{ collectionId: string }>();

  const dispatch = useDispatch<AppDispatch>();

  const { albumTracks, currentTrack, isPlaying, loading, error } = useSelector(
    (state: RootState) => state.player
  );

  useEffect(() => {
    if (collectionId) {
      // Convertimos a número porque fetchAlbumTracks espera number
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
      dispatch(setCurrentTrack(track));
    }
  };

  if (loading) {
    return <div className="p-6 text-neutral-400">Cargando pistas del álbum...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-400">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Cabecera del Álbum (usando los datos de la primera pista o del store) */}
      {albumTracks && albumTracks.length > 0 && (
        <div className="flex items-center gap-6 mb-8">
          <img
            src={albumTracks[0].albumArtwork || albumTracks[0].artworkUrl100}
            alt={albumTracks[0].collectionName}
            className="w-40 h-40 rounded-xl object-cover shadow-2xl bg-neutral-800"
          />
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
              Álbum
            </span>
            <h1 className="text-3xl font-bold mt-1 text-white">
              {albumTracks[0].collectionName}
            </h1>
            <p className="text-neutral-400 mt-2">
              {albumTracks[0].artistName} • {albumTracks.length} canciones
            </p>
          </div>
        </div>
      )}

      {/* Lista de canciones */}
      <div className="flex flex-col gap-1">
        {albumTracks?.map((track, index) => {
          const isCurrent = currentTrack?.trackId === track.trackId;
          const isThisPlaying = isCurrent && isPlaying;

          return (
            <div
              key={track.trackId}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                isCurrent
                  ? 'bg-neutral-800/90 border border-emerald-500/40 text-emerald-400'
                  : 'hover:bg-neutral-900 text-neutral-200'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-neutral-500 w-6 text-right text-sm shrink-0">
                  {index + 1}
                </span>
                <div className="truncate">
                  <p className="font-medium text-sm truncate">{track.trackName}</p>
                  <p className="text-xs text-neutral-400 truncate">{track.artistName}</p>
                </div>
              </div>

              <button
                onClick={() => handlePlaySong(track)}
                className={`p-2.5 rounded-full transition-all shrink-0 ${
                  isThisPlaying
                    ? 'bg-emerald-500 text-black'
                    : 'bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
                aria-label={isThisPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isThisPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};