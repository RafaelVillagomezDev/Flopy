import type React from 'react';
import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Disc3 } from 'lucide-react';
import { IconBase } from './IconBase';

interface AlbumCardProps {
  to: string;
  src: string;
  artistName?: string;
  trackName?: string;
  albumName?: string;
  children?: ReactNode;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  to,
  src,
  artistName,
  trackName,
  albumName,
  children,
}) => {
  const hasMeta = Boolean(trackName || albumName || artistName);
  const primaryTitle = trackName || albumName || artistName || 'Sin título';

  return (
    <NavLink
      to={to}
      className="group flex flex-col p-3 rounded-2xl bg-neutral-900/60 transition-all duration-300 w-full max-w-[200px] select-none active:scale-[0.98] [@media(hover:hover)]:hover:bg-neutral-800/80"
    >
      {/* Portada e indicador de reproducción */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-800 shadow-md transition-shadow [@media(hover:hover)]:group-hover:shadow-xl [@media(hover:hover)]:group-hover:shadow-black/50">
        <img
          src={src}
          alt={primaryTitle}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none opacity-100 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100" />
        <div
          aria-hidden="true"
          className="absolute right-2.5 bottom-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transition-all duration-300 ease-out opacity-100 translate-y-0 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:scale-105"
        >
          <IconBase icon={Disc3} className="w-5 h-5 text-white animate-[spin_6s_linear_infinite]" />
        </div>
      </div>

      {/* Datos o Children alternativo */}
      <div className="mt-3 flex flex-col gap-0.5 min-w-0">
        {hasMeta ? (
          <>
            <span
              title={primaryTitle}
              className="text-sm font-semibold text-white/90 truncate transition-colors [@media(hover:hover)]:group-hover:text-white"
            >
              {primaryTitle}
            </span>
            {artistName && (
              <span
                title={albumName ? `${artistName} • ${albumName}` : artistName}
                className="text-xs text-neutral-400 truncate"
              >
                {artistName}
                {albumName && trackName && (
                  <span className="text-neutral-500"> • {albumName}</span>
                )}
              </span>
            )}
          </>
        ) : (
          children
        )}
      </div>
    </NavLink>
  );
};