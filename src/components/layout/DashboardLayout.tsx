import { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar } from '@components/ui/Sidebar';
import { PlayerBar } from '@components/ui/PlayerBar';
import type { RootState, AppDispatch } from '@/store/store';

import {
    setTimeUpdate,
    setIsPlaying,
    resetSeek,
} from '@/modules/player/player.slice';

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const videoRef = useRef<HTMLVideoElement>(null);

    const { currentTrack, isPlaying, isMuted, seekTime, volume } = useSelector(
        (state: RootState) => state.player
    );

    // Control de Play / Pause
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !currentTrack) return;

        if (isPlaying) {
            video.play().catch((err) => {
                console.warn('Reproducción bloqueada o interrumpida:', err);
                dispatch(setIsPlaying(false));
            });
        } else {
            video.pause();
        }
    }, [isPlaying, currentTrack, dispatch]);

    // 2. Control de Silencio (Mute)
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // 3. Sincronización del salto en la barra (Seek)
    useEffect(() => {
        if (videoRef.current && seekTime !== null) {
            videoRef.current.currentTime = seekTime;
            dispatch(resetSeek());
        }
    }, [seekTime, dispatch]);

    // 4 . Control de Volumen
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <div
            className="grid h-screen
        grid-cols-[80px_1fr] md:grid-cols-[180px_1fr] lg:grid-cols-[240px_1fr_300px] 
        grid-rows-[1fr_90px] overflow-hidden bg-[#121212] text-white font-sans"
        >
            {/* 
        MOTOR MULTIMEDIA:
        Persistente e invisible. Al estar en la raíz del layout, nunca se desmonta
        al cambiar de vista en el área central (children).
      */}
            <video
                ref={videoRef}
                src={currentTrack?.previewUrl}
                playsInline
                className="hidden"
                onLoadedMetadata={(e) => {
                    dispatch(
                        setTimeUpdate({
                            currentTime: 0,
                            duration: e.currentTarget.duration || 0,
                        })
                    );
                }}
                onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    dispatch(
                        setTimeUpdate({
                            currentTime: video.currentTime,
                            duration: video.duration || 0,
                        })
                    );
                }}
                onEnded={() => dispatch(setIsPlaying(false))}
            />

            {/* PANEL IZQUIERDO: Reducido en tablet */}
            <aside className="col-start-1 row-start-1 overflow-y-auto bg-black p-3 md:p-4 border-r border-gray-800 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                <h2 className="text-lg md:text-xl font-bold mb-6 text-center md:text-left">Flopy</h2>
                <Sidebar />
            </aside>

            {/* CONTENIDO CENTRAL */}
            <main className="col-start-2 row-start-1 overflow-y-auto bg-[#181818] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                {children}
            </main>

            {/* PANEL DERECHO: Top Streams */}
            <aside className="hidden lg:block lg:col-start-3 row-start-1 overflow-y-auto bg-black p-4 border-l border-gray-800">
                <h2 className="font-bold mb-4">Top Streams</h2>
            </aside>

            {/* REPRODUCTOR INFERIOR */}
            <aside className="col-span-full row-start-2 bg-[#282828] border-t border-gray-800 z-10">
                <PlayerBar />
            </aside>
        </div>
    );
};