import { BannerCardHead } from '@/components/ui/BannerCardHead';
import { useAppDispatch } from '@/hooks/hooks';
import { useArtistBio } from '@/hooks/useArtistBio';
import type { RootState } from '@/store/store';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchArtistAlbums } from "@modules/singer/singer.slice"
import { Loader } from '@/components/ui/Loader';
import { AlertCircle, Disc3 } from 'lucide-react';
import { CardLayout } from '@/components/layout/CardLayout';
import { AlbumCard } from '@/components/ui/AlbumCard';

export const Singer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { singerName } = useParams<{ singerName: string }>();


    const [isImageLoaded, setIsImageLoaded] = useState(false);


    const decodedSingerName = useMemo(() => {
        if (!singerName) return '';
        return decodeURIComponent(singerName.replace(/\+/g, ' ')).trim();
    }, [singerName]);


    const { singer, status: bioStatus, isLoading: isBioLoading, error: bioError } = useArtistBio(decodedSingerName);


    const { topSingers, artistAlbums, albumsError, albumsStatus } = useSelector((state: RootState) => state.singer);

    const deezerSingerInfo = useMemo(() => {
        if (!topSingers || !decodedSingerName) return undefined;
        const searchName = decodedSingerName.toLowerCase().trim();
        return topSingers.find(s => s.name.toLowerCase().trim() === searchName);
    }, [topSingers, decodedSingerName]);

    const displayImage = singer?.strArtistThumb || deezerSingerInfo?.picture_xl || deezerSingerInfo?.picture_big;
    const displayName = singer?.strArtist || deezerSingerInfo?.name || decodedSingerName;

    const artistAlbumPromise = useRef<{ abort: () => void } | null>(null);

    useEffect(() => {
        if (decodedSingerName) {
            artistAlbumPromise.current?.abort?.();
            const itunesSearchTerm = decodedSingerName.replace(/\s+/g, '+');
            artistAlbumPromise.current = dispatch(fetchArtistAlbums(itunesSearchTerm));
        }
        return () => {
            artistAlbumPromise.current?.abort?.();
        };
    }, [decodedSingerName, dispatch]);



    useEffect(() => {
        if (!displayImage) return;

        setIsImageLoaded(false);

        const img = new window.Image();
        img.fetchPriority = "high";
        img.src = displayImage;

        img.onload = () => {
            setIsImageLoaded(true);
        };
    }, [displayImage]);


    const isPageLoading = isBioLoading || albumsStatus === 'loading' || albumsStatus === 'idle';

    if (isPageLoading) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
                <Loader icon={Disc3}>Cargando perfil y discografía de {decodedSingerName}...</Loader>
            </div>
        );
    }


    const pageError = bioError || albumsError;

    if (pageError) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full p-4 bg-red-950/40 border border-red-800 rounded-xl flex items-center gap-3 text-red-300">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <div>
                        <h3 className="font-bold text-red-200">Error al cargar</h3>
                        <p className="text-sm opacity-90">{String(pageError)}</p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="max-w-full mx-auto animate-in fade-in duration-500">
            <BannerCardHead bannerImg={displayImage}>
                <div className="w-full flex items-center gap-x-6 sm:gap-x-8">


                    <div className="relative w-24 h-24 sm:w-36 sm:h-36 shrink-0 rounded-full bg-neutral-800 shadow-2xl overflow-hidden border border-neutral-700">


                        {!isImageLoaded && (
                            <div className="absolute inset-0 bg-neutral-700/50 animate-pulse" />
                        )}


                        {isImageLoaded && displayImage && (
                            <img
                                src={displayImage}
                                alt={displayName}
                                className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500"
                            />
                        )}
                    </div>

                    <div className="flex flex-col min-w-0 gap-y-2">
                        {deezerSingerInfo?.position && (
                            <span className="w-fit px-3 py-1 mb-1 text-xs font-bold tracking-widest text-white uppercase bg-red-600/80 border border-red-500 rounded-full shadow-md backdrop-blur-sm">
                                #{deezerSingerInfo.position} en Tendencias
                            </span>
                        )}

                        <h1 className="text-3xl sm:text-6xl font-bold truncate capitalize">
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

            <section className="mt-6">
                {artistAlbums && artistAlbums.length > 0 ? (
                    <CardLayout>
                        {artistAlbums.map((album) => (
                            <AlbumCard
                                key={album.collectionId}
                                to={`/album/${encodeURIComponent(album.collectionId)}`}
                                src={album.artworkUrl300}
                            >
                                <span
                                    title={album.artistName}
                                    className="text-sm font-semibold text-white/90 truncate block hover:text-white"
                                >
                                    {album.artistName}
                                </span>
                                <span className="text-xs text-neutral-400 block mt-0.5 truncate ">
                                    {album.collectionName}
                                </span>
                            </AlbumCard>
                        ))}
                    </CardLayout>
                ) : (
                    <div className="text-center text-neutral-500 py-10">
                        No se encontraron álbumes para este artista.
                    </div>
                )}
            </section>
        </div>
    );
};