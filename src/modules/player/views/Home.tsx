import React, { useEffect, useState } from 'react';
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Reemplaza uno o más espacios en blanco consecutivos por un '+'
    const formattedTerm = searchTerm.trim().replace(/\s+/g, '+');

    dispatch(fetchArtists(formattedTerm));
  };

  useEffect(() => {
    if (currentItem && currentItem.length > 0) return;

    const promise = dispatch(fetchRandomSongs());

    return () => {
      promise.abort();
    };
  }, [dispatch, currentItem]);

  return (
    <div className="max-w-full mx-auto p-6">
      {/* Formulario de búsqueda */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        loading={Boolean(loading)}
      />


      {/* Estado de error */}
      {Boolean(error) && !loading && (
        <div className="p-4 bg-red-950/40 border border-red-800 rounded-xl text-red-300 text-sm">
          {String(error)}
        </div>
      )}

      {/* Grid de resultados */}
      {!loading && currentItem && currentItem.length > 0 && (
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
      )}

      {/* Sin resultados */}
      {!loading && !error && currentItem?.length === 0 && (
        <p className="text-neutral-400 text-sm">No se encontraron pistas disponibles.</p>
      )}
    </div>
  );
};