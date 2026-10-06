import type { TrackItem } from '@/types/track.type';
import { NavLink } from 'react-router-dom';

interface AlbumCardHeadProps {
    album: TrackItem[];
    navTo: string;
}

export const AlbumCardHead: React.FC<AlbumCardHeadProps> = ({ album, navTo }) => {
    if (!album || album.length === 0) return null;

    const firstTrack = album[0];
    
   
    const highResArtwork = firstTrack.artworkUrl100?.replace(/\d+x\d+bb/g, '500x500bb') || '';

    return ( 
        <div className="flex items-end gap-4 sm:gap-6 mb-8">
            
        
            <img
                src={highResArtwork}
                alt={firstTrack.collectionName || 'Portada del álbum'}
                fetchPriority="high"
                className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-xl object-cover shadow-2xl bg-neutral-800"
            />
            

            <div className="flex flex-col min-w-0 pb-1">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">
                    Álbum
                </span>
                
           
                <h1 
                    className="text-2xl sm:text-4xl font-extrabold text-white truncate"
                    title={firstTrack.collectionName}
                >
                    {firstTrack.collectionName || 'Álbum sin título'}
                </h1>
                
    +
                <div className="flex items-center gap-1.5 mt-2 text-sm text-neutral-400">
                    <NavLink 
                        to={navTo} 
                        className="font-semibold text-white/90 hover:text-white hover:underline transition-colors truncate"
                    >
                        {firstTrack.artistName}
                    </NavLink>
                    <span className="opacity-50">•</span>
                    <span className="shrink-0">{album.length} canciones</span>
                </div>
            </div>

        </div>
    );
};