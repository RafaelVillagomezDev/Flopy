import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Disc3, Search } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store/store';
import {
  fetchArtists,
  fetchRandomAlbums,
  setSearchTerm,
  setIsSearchActive,
  clearSearch,
} from '@modules/player/player.slice';
import { SearchBar } from '@/components/ui/SearchBar';
import { AlbumCard } from '@/components/ui/AlbumCard';
import { CardLayout } from '@/components/layout/CardLayout';
import { Loader } from '@/components/ui/Loader';

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    randomAlbums,
    searchResults,
    searchTerm,
    isSearchActive,
    loading,
    error,
  } = useSelector((state: RootState) => state.player);

  // Dos referencias independientes para no pisarse ni cancelarse entre sí
  const searchPromiseRef = useRef<{ abort: () => void } | null>(null);
  const randomPromiseRef = useRef<{ abort: () => void } | null>(null);

  //  Carga inicial: Solo al montar el componente si no hay datos en caché
  useEffect(() => {
    // Si no venimos de una búsqueda y el feed de álbumes está vacío
    if (!isSearchActive && (!randomAlbums || randomAlbums.length === 0)) {
      randomPromiseRef.current?.abort?.();
      randomPromiseRef.current = dispatch(fetchRandomAlbums());
    }

    return () => {
      // Al desmontar la página (navegar a un álbum), solo abortamos si los aleatorios seguían cargando evitamos peticiones fantasmas 
      randomPromiseRef.current?.abort?.();
      searchPromiseRef.current?.abort?.();
    };
  // Dejamos el array VACÍO (o solo [dispatch]) para que NO se ejecute el cleanup en cada búsqueda
 
  }, [dispatch]);

  //  Submit de la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTerm = searchTerm.trim();

    if (!cleanTerm) {
      dispatch(clearSearch()); 
      return;
    }

    dispatch(setIsSearchActive(true));

    // Cancelamos únicamente una búsqueda previa si el usuario dio Enter dos veces seguidas
    searchPromiseRef.current?.abort?.();
    searchPromiseRef.current = dispatch(fetchArtists(cleanTerm));
  };

  //  Modificaciones en el input
  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value));

    // Si el usuario vacía el input
    if (value.trim() === '') {
      searchPromiseRef.current?.abort?.();
      dispatch(clearSearch());

      // Si por alguna razón no hubiera álbumes aleatorios, los cargamos
      if (!randomAlbums || randomAlbums.length === 0) {
        randomPromiseRef.current?.abort?.();
        randomPromiseRef.current = dispatch(fetchRandomAlbums());
      }
    }
  };


  const itemsToRender = isSearchActive ? searchResults : randomAlbums;

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

      {!loading && itemsToRender && itemsToRender.length > 0 && (
        <div className="mt-6 ">
          <h2 className="font-bold  text-lg sm:text-xl ml-6">Albums recomendados</h2>
          <CardLayout>
            {itemsToRender
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

      {!loading && !error && (!itemsToRender || itemsToRender.length === 0) && (
        <p className="text-neutral-400 text-sm mt-6 text-center py-12">
          {isSearchActive
            ? `No se encontraron resultados para "${searchTerm}".`
            : 'No hay álbumes recomendados disponibles.'}
        </p>
      )}
    </div>
  );
};