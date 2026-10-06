import { BannerCardHead } from '@/components/ui/BannerCardHead';
import { useArtistBio } from '@/hooks/useArtistBio';
import type { RootState } from '@/store/store';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const Singer: React.FC = () => {
    const { singerName } = useParams<{ singerName: string }>();

    const { singer } = useArtistBio(singerName);
    

    const { topSingers } = useSelector((state: RootState) => state.singer);

    //  Buscar en el topSingers usando useMemo (solo se recalcula si cambian el nombre o la lista)
    const deezerSingerInfo = useMemo(() => {
        if (!topSingers || !singerName) return undefined;
        const searchName = decodeURIComponent(singerName).toLowerCase().trim();
        return topSingers.find(s => s.name.toLowerCase().trim() === searchName);
    }, [topSingers, singerName]);

    // Usar la foto de TheAudioDB o, si no existe
    const displayImage = singer?.strArtistThumb || deezerSingerInfo?.picture_xl || deezerSingerInfo?.picture_big;
    const displayName = singer?.strArtist || deezerSingerInfo?.name || decodeURIComponent(singerName || '');

    return (
        <div className="max-w-full mx-auto">
            <BannerCardHead bannerImg={displayImage}>
                <div className="w-full flex items-center gap-x-6 sm:gap-x-8">
                    <img
                        className="w-24 h-24 sm:w-36 sm:h-36 shrink-0 rounded-full object-cover shadow-2xl"
                        src={displayImage}
                        alt={displayName}
                    />
                    <div className="flex flex-col min-w-0 gap-y-2">
                        <h1 className="text-3xl sm:text-6xl font-bold line-clamp-2 break-words capitalize">
                            {displayName}
                        </h1>
                        <p className="text-sm text-neutral-300">
                            {singer?.strGenre || (deezerSingerInfo ? `#${deezerSingerInfo.position} en Tendencias` : 'Artista')}
                        </p>
                    </div>
                </div>
            </BannerCardHead>
        </div>
    );
};