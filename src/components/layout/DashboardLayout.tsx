import type { ReactNode } from 'react';
import { Sidebar } from '@components/ui/Sidebar';
import { PlayerBar } from '@components/ui/PlayerBar';
import { CoverCard } from '../ui/CoverCard';
import { SingerCard } from '../ui/SingerCard';
import { useAudioSync } from '@hooks/useAudioSync';
import { useArtistBio } from '@hooks/useArtistBio';
import { StickyBanner } from '@/components/ui/StickyBanner'; // 1. Importas el banner

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { mediaRef, currentTrack, mediaHandlers } = useAudioSync();
    const { singer } = useArtistBio(currentTrack?.artistName);

    return (
        <div className="grid h-screen grid-cols-[80px_1fr] md:grid-cols-[180px_1fr] lg:grid-cols-[240px_1fr_300px] grid-rows-[1fr_90px] overflow-hidden bg-[#121212] text-white font-sans">

            {/* Motor multimedia */}
            <video
                ref={mediaRef}
                src={currentTrack?.previewUrl}
                playsInline
                className="hidden"
                {...mediaHandlers}
            />

            {/* PANEL IZQUIERDO */}
            <aside className="col-start-1 row-start-1 overflow-y-auto bg-black p-3 md:p-4 border-r border-gray-800 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                <h2 className="text-lg md:text-xl font-bold mb-6 text-center md:text-left">Flopy</h2>
                <Sidebar />
            </aside>

            {/* CONTENIDO CENTRAL */}
            <main className="col-start-2 row-start-1 overflow-y-auto bg-[#181818] [&::-webkit-scrollbar]:hidden [scrollbar-width:none] relative">

              
                <StickyBanner
                    message="Página en desarrollo"
                    actionText="Ver código"
                />

                <div className="w-full">
                    {children}
                </div>
            </main>

            {/* PANEL DERECHO */}
            <aside className="hidden lg:block lg:col-start-3 row-start-1 overflow-y-auto bg-black p-4 border-l border-gray-800 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                <CoverCard
                    textSong={currentTrack?.collectionName}
                    imageCover={currentTrack?.artworkUrl300}
                    textSinger={currentTrack?.artistName}
                >
                    <p className="font-bold text-sm sm:text-base mb-3" title={currentTrack?.trackName}>
                        {currentTrack?.trackName}
                    </p>
                </CoverCard>

                {singer?.strArtist && (
                    <SingerCard
                        strArtist={singer.strArtist}
                        strArtistAlternate={singer.strArtistAlternate}
                        strArtistThumb={singer.strArtistThumb}
                    >
                        <div className="flex flex-col min-w-0 w-full">
                            <p className="text-xs text-neutral-400 line-clamp-12">
                                {singer.strBiographyES || singer.strBiographyEN}
                            </p>
                        </div>
                    </SingerCard>
                )}
            </aside>

            {/* REPRODUCTOR INFERIOR */}
            <footer className="col-span-full row-start-2 bg-[#282828] border-t border-gray-800 z-10">
                <PlayerBar />
            </footer>
        </div>
    );
};