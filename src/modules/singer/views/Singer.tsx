import { BannerCardHead } from '@/components/ui/BannerCardHead';
import { useAppDispatch } from '@/hooks/hooks';
import { useArtistBio } from '@/hooks/useArtistBio';
import type { RootState } from '@/store/store';
import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchArtistAlbums } from "@modules/singer/singer.slice"
import { Loader } from '@/components/ui/Loader';
import { TrendingUp } from 'lucide-react';
import { CardLayout } from '@/components/layout/CardLayout';
import { AlbumCard } from '@/components/ui/AlbumCard';

export const Singer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { singerName } = useParams<{ singerName: string }>();

    const { singer } = useArtistBio(singerName);


    const { topSingers, artistAlbums, albumsError, albumsStatus } = useSelector((state: RootState) => state.singer);


    //  Buscar en el topSingers usando useMemo (solo se recalcula si cambian el nombre o la lista)
    const deezerSingerInfo = useMemo(() => {
        if (!topSingers || !singerName) return undefined;
        const searchName = decodeURIComponent(singerName).toLowerCase().trim();
        return topSingers.find(s => s.name.toLowerCase().trim() === searchName);
    }, [topSingers, singerName]);

    // Usar la foto de TheAudioDB o, si no existe
    const displayImage = singer?.strArtistThumb || deezerSingerInfo?.picture_xl || deezerSingerInfo?.picture_big;
    const displayName = singer?.strArtist || deezerSingerInfo?.name || decodeURIComponent(singerName || '');


    const artistAlbumPromise = useRef<{ abort: () => void } | null>(null);

    useEffect(() => {
        if (singerName) {
            artistAlbumPromise.current?.abort?.();
            artistAlbumPromise.current = dispatch(fetchArtistAlbums(singerName));
        }
        return () => {
            artistAlbumPromise.current?.abort?.();
        };
    }, [singerName, dispatch]);

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


                        {deezerSingerInfo?.position && (
                            <span className="w-fit px-3 py-1 mb-1 text-xs font-bold tracking-widest text-white uppercase bg-red-600/80 border border-red-500 rounded-full shadow-md backdrop-blur-sm">
                                #{deezerSingerInfo.position} en Tendencias
                            </span>
                        )}


                        <h1 className="text-3xl sm:text-6xl font-bold line-clamp-2 break-words capitalize">
                            {displayName}
                        </h1>


                        <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-medium text-neutral-300">
                                {singer?.strGenre || 'Artista'}
                            </p>

                            {singer?.strStyle && (
                                <p className="text-sm text-neutral-400">
                                    {singer.strStyle}
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </BannerCardHead>
            <section>
                {albumsStatus === 'loading' && (
                    <div className="py-8 flex justify-center">
                        <Loader icon={TrendingUp}>Cargando artistas en tendencia...</Loader>
                    </div>
                )}

                {Boolean(albumsError) && albumsStatus === 'failed' && (
                    <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-red-300 text-xs ml-6">
                        {String(albumsError)}
                    </div>
                )}

                {artistAlbums && artistAlbums.length > 0 && (
                    <CardLayout>
                        {artistAlbums.map((singer,index) => (
                            <AlbumCard
                                key={`singer-${index}`}
                                to={`/album/${encodeURIComponent(singer.collectionId)}`}
                                src={singer.artworkUrl300}
                            >
                                <span
                                    title={singer.artistName}
                                    className="text-sm font-semibold text-white/90 truncate block hover:text-white"
                                >
                                    {singer.artistName}
                                </span>
                                <span className="text-xs text-neutral-400 block mt-0.5">
                                    #{singer.collectionName}
                                </span>
                            </AlbumCard>
                        ))}
                    </CardLayout>
                )}
            </section>
        </div>
    );
};