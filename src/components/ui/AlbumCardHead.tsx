import type { TrackItem } from '@/types/track.type';

interface AlbumCardHeadProps {
    album: TrackItem[];
}

export const AlbumCardHead: React.FC<AlbumCardHeadProps> = ({ album }) => {

    if (!album || album.length === 0) return null;

    const firstTrack = album[0];
    const highResArtwork = firstTrack.artworkUrl100?.replace('100x100bb.jpg', '500x500bb.jpg') || '';

    return ( 
        <div className="flex items-center gap-6 mb-8">
            <img
                src={highResArtwork}
                alt={firstTrack.collectionName || 'Portada del álbum'}
                className="w-40 h-40 rounded-xl object-cover shadow-2xl bg-neutral-800"
            />
            <div>
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                    Álbum
                </span>
                <h1 className="text-3xl font-bold mt-1 text-white">
                    {firstTrack.collectionName || 'Álbum sin título'}
                </h1>
                <p className="text-neutral-400 mt-2">
                    {firstTrack.artistName} • {album.length} canciones
                </p>
            </div>
        </div>
    );
};