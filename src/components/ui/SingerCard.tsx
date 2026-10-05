import React, { useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface ArtistCardProps {
    strArtistThumb?: string | null;
    strArtist?: string;
    strArtistAlternate?: string | null;
    className?: string;
    children?: ReactNode;
}

export const SingerCard: React.FC<ArtistCardProps> = ({
    strArtistThumb,
    strArtist = "Artista desconocido",
    strArtistAlternate,
    className,
    children,
}) => {
    const [hasError, setHasError] = useState(false);

    const hasValidImage = Boolean(
        strArtistThumb && strArtistThumb.trim() !== "" && !hasError
    );

    return (
        <article
            className={cn(
                "w-full max-w-sm rounded-2xl overflow-hidden bg-[#181818] text-white shadow-xl flex flex-col font-sans transition-colors duration-200",
                className
            )}
        >
            <div className="relative w-full aspect-[4/3] bg-[#282828] overflow-hidden flex items-center justify-center">
                {hasValidImage ? (
                    <img
                        src={strArtistThumb!}
                        alt={strArtist}
                        onError={() => setHasError(true)}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-[#a7a7a7] select-none">
                        <svg
                            className="w-12 h-12 mb-2 opacity-40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        <span className="text-xs font-medium tracking-wide uppercase">
                            Sin portada
                        </span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-4 left-4 text-xs sm:text-sm font-bold tracking-tight text-white drop-shadow-md">
                    Información sobre el artista
                </span>
            </div>


            <div className="p-5 flex flex-col flex-1">

                <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold tracking-tight truncate text-white">
                        {strArtist}
                    </h2>

                    <span className="text-[#3d91f4] flex-shrink-0" title="Artista verificado">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
                        </svg>
                    </span>
                </div>

                {strArtistAlternate && (
                    <p className="text-xs text-[#a7a7a7] italic mb-3">
                        También conocido como: {strArtistAlternate}
                    </p>
                )}

                {children && <div className="mt-2 flex flex-col gap-3">{children}</div>}
            </div>
        </article>
    );
};