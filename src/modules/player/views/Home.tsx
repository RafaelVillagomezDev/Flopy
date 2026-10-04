import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Disc3, Search } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store/store';
import {
  fetchArtists,
  fetchRandomAlbums,
  setSearchTerm,
  setIsSearchActive,
} from '@modules/player/player.slice';
import { SearchBar } from '@/components/ui/SearchBar';
import { AlbumCard } from '@/components/ui/AlbumCard';
import { CardLayout } from '@/components/layout/CardLayout';
import { Loader } from '@/components/ui/Loader';

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { searchResults, searchTerm, isSearchActive, loading, error } = useSelector(
    (state: RootState) => state.player
  );

  const activePromiseRef = useRef<{ abort: () => void } | null>(null);

  const loadRandomAlbums = useCallback((force = false) => {
    // Si ya hay resultados en Redux y no se fuerza, preservamos la caché en memoria
    if (!force && searchResults && searchResults.length > 0) return;

    activePromiseRef.current?.abort?.();
    const promise = dispatch(fetchRandomAlbums());
    activePromiseRef.current = promise;
    return promise;
  }, [dispatch, searchResults]);

  useEffect(() => {
    // Si no hay búsqueda activa y no hay datos cargados, cargamos aleatorios
    if (!isSearchActive && (!searchResults || searchResults.length === 0)) {
      loadRandomAlbums();
    }

    return () => {
      activePromiseRef.current?.abort?.();
    };
  }, [isSearchActive, searchResults, loadRandomAlbums]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      dispatch(setIsSearchActive(false));
      loadRandomAlbums(true);
      return;
    }

    dispatch(setIsSearchActive(true));
    const formattedTerm = searchTerm.trim().replace(/\s+/g, '+');
    activePromiseRef.current?.abort?.();
    const promise = dispatch(fetchArtists(formattedTerm));
    activePromiseRef.current = promise;
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value));

    // Si el usuario vacía el input manualmente, volvemos a los álbumes aleatorios
    if (value.trim() === '') {
      dispatch(setIsSearchActive(false));
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

      {loading && (
        <div className="py-20 flex justify-center">
          <Loader icon={isSearchActive ? Search : Disc3}>
            {isSearchActive
              ? `Buscando resultados para "${searchTerm}"...`
              : 'Cargando álbumes recomendados...'}
          </Loader>
        </div>
      )}

      {Boolean(error) && !loading && (
        <div className="p-4 bg-red-950/40 border border-red-800 rounded-xl text-red-300 text-sm mt-6">
          {String(error)}
        </div>
      )}

      {!loading && searchResults && searchResults.length > 0 && (
        <div className="mt-6">
          <CardLayout>
            {searchResults
              .filter((item) => (isSearchActive ? true : item.wrapperType === 'collection'))
              .map((item) => {
                const isTrack = item.wrapperType === 'track';
                const uniqueKey = isTrack ? `track-${item.trackId}` : `album-${item.collectionId}`;
                const linkTo = `/album/${item.collectionId}`;
                const imageSrc = isTrack
                  ? item.albumArtwork || item.artworkUrl100
                  : item.artworkUrl;
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

      {!loading && !error && searchResults?.length === 0 && (
        <p className="text-neutral-400 text-sm mt-6 text-center py-12">
          No se encontraron pistas disponibles.
        </p>
      )}
    </div>
  );
};