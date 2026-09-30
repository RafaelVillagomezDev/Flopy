import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchArtists } from '@modules/player/player.slice';
import { SearchBar } from '@/components/ui/SearchBar';

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

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Formulario de búsqueda */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        loading={Boolean(loading)}
      />

      {/* Manejo de error */}
      {Boolean(error) && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {String(error)}
        </div>
      )}

      {/* Listado de resultados */}
      <div className="space-y-2">
        {currentItem && currentItem.length > 0 ? (
          currentItem.map((item, index) => {
            const title =
              item.wrapperType === 'track' ? item.trackName : item.collectionName;

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg shadow-sm bg-white"
              >
                <img
                  src={item.artworkUrl100}
                  alt={item.artistName}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{title}</p>
                  <p className="text-xs text-gray-500 truncate">{item.artistName}</p>
                  <span className="text-[10px] uppercase font-bold text-indigo-600">
                    {item.trackName}
                  </span>

                </div>
              </div>
            );
          })
        ) : (
          !loading && <p className="text-sm text-gray-400">No hay resultados para mostrar.</p>
        )}
      </div>
    </div>
  );
};