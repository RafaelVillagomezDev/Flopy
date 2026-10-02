import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchArtists, fetchRandomAlbums } from '@modules/player/player.slice';
import { SearchBar } from '@/components/ui/SearchBar';
import { AlbumCard } from '@/components/ui/AlbumCard';
import { CardLayout } from '@/components/layout/CardLayout';

export const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Flag para saber si hay una búsqueda activa
  const [isSearchActive, setIsSearchActive] = useState(false); 
  
  const dispatch = useDispatch<AppDispatch>();

  const { currentItem, loading, error } = useSelector(
    (state: RootState) => state.player
  );

  const activePromiseRef = useRef<{ abort: () => void } | null>(null);

  const loadRandomAlbums = useCallback((force = false) => {
    if (!force && currentItem && currentItem.length > 0) return;

    activePromiseRef.current?.abort?.();
    const promise = dispatch(fetchRandomAlbums());
    activePromiseRef.current = promise;
    return promise;
  }, [dispatch, currentItem]);

  useEffect(() => {
    loadRandomAlbums();
    return () => {
      activePromiseRef.current?.abort?.();
    };
  }, [loadRandomAlbums]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setIsSearchActive(false);
      loadRandomAlbums(true);
      return;
    }

    // Si busca texto real: activamos el flag y llamamos a la API
    setIsSearchActive(true);
    const formattedTerm = searchTerm.trim().replace(/\s+/g, '+');
    activePromiseRef.current?.abort?.();
    const promise = dispatch(fetchArtists(formattedTerm));
    activePromiseRef.current = promise;
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value.trim() === '') {
      setIsSearchActive(false);
      loadRandomAlbums(true);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6">
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearch}
        loading={Boolean(loading)}
      />

      {Boolean(error) && !loading && (
        <div className="p-4 bg-red-950/40 border border-red-800 rounded-xl text-red-300 text-sm mt-4">
          {String(error)}
        </div>
      )}

      {/* Grid de resultados controlado por isSearchActive */}
      {!loading && currentItem && currentItem.length > 0 && (
        <div className="mt-6">
          <CardLayout>
            {currentItem
              // Si NO hay búsqueda, filtramos solo álbumes. Si hay búsqueda, dejamos pasar todo (true)
              .filter((item) => isSearchActive ? true : item.wrapperType === 'collection')
              .map((item) => {
                const isTrack = item.wrapperType === 'track';

                // Extracción segura para TypeScript
                const uniqueKey = isTrack ? `track-${item.trackId}` : `album-${item.collectionId}`;
                const linkTo = isTrack ? `/track/${item.trackId}` : `/album/${item.collectionId}`;
                const imageSrc = isTrack ? (item.albumArtwork || item.artworkUrl100) : item.artworkUrl;
                const titleTrack = isTrack ? item.trackName : undefined;

                return (
                  <AlbumCard
                    key={uniqueKey}
                    to={linkTo}
                    src={imageSrc}
                    artistName={item.artistName}
                    albumName={item.collectionName || 'Álbum desconocido'}
                    trackName={titleTrack}
                  />
                );
              })}
          </CardLayout>
        </div>
      )}

      {!loading && !error && currentItem?.length === 0 && (
        <p className="text-neutral-400 text-sm mt-6">
          No se encontraron pistas disponibles.
        </p>
      )}
    </div>
  );
};