import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchArtists, fetchRandomSongs } from '@modules/player/player.slice';
import { SearchBar } from '@/components/ui/SearchBar';
import { AlbumCard } from '@/components/ui/AlbumCard';
import { CardLayout } from '@/components/layout/CardLayout';

export const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const { currentItem, loading, error } = useSelector(
    (state: RootState) => state.player
  );

  // Referencia para cancelar peticiones si el usuario escribe o navega rápido
  const activePromiseRef = useRef<{ abort: () => void } | null>(null);

  //  Cargar aleatorias (con flag force para saltarse la caché si se limpia la búsqueda)
  const loadRandomSongs = useCallback((force = false) => {
    if (!force && currentItem && currentItem.length > 0) return;

    activePromiseRef.current?.abort?.();
    const promise = dispatch(fetchRandomSongs());
    activePromiseRef.current = promise;
    return promise;
  }, [dispatch, currentItem]);

  
  useEffect(() => {
    loadRandomSongs();

    return () => {
      activePromiseRef.current?.abort?.();
    };
  }, [loadRandomSongs]);

  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Si el usuario envía estando vacío, restauramos las canciones aleatorias
    if (!searchTerm.trim()) {
      loadRandomSongs(true);
      return;
    }

    const formattedTerm = searchTerm.trim().replace(/\s+/g, '+');
    activePromiseRef.current?.abort?.();
    const promise = dispatch(fetchArtists(formattedTerm));
    activePromiseRef.current = promise;
  };

  // 3. Detectar en tiempo real cuando el input se vacía
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value.trim() === '') {
      loadRandomSongs(true);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6">
      {/* Formulario de búsqueda */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearch}
        loading={Boolean(loading)}
      />

      {/* Estado de error */}
      {Boolean(error) && !loading && (
        <div className="p-4 bg-red-950/40 border border-red-800 rounded-xl text-red-300 text-sm mt-4">
          {String(error)}
        </div>
      )}

      {/* Grid de resultados */}
      {!loading && currentItem && currentItem.length > 0 && (
        <div className="mt-6">
          <CardLayout>
            {currentItem.map((item) => (
              <AlbumCard
                key={item.trackId}
                to={`/track/${item.trackId}`}
                src={item.artworkUrl100}
                artistName={item.artistName}
                trackName={item.trackName}
              />
            ))}
          </CardLayout>
        </div>
      )}

      {/* Sin resultados */}
      {!loading && !error && currentItem?.length === 0 && (
        <p className="text-neutral-400 text-sm mt-6">
          No se encontraron pistas disponibles.
        </p>
      )}
    </div>
  );
};