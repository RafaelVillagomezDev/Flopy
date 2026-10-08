import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Disc3, Search, TrendingUp, Library } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store/store';
import {
  fetchArtists,
  fetchRandomAlbums,
  setSearchTerm,
  setIsSearchActive,
  clearSearch,
} from '@modules/player/player.slice';
import { fetchTopArtistsByCountry } from '@modules/singer/singer.slice';
import { SearchBar } from '@/components/ui/SearchBar';
import { AlbumCard } from '@/components/ui/AlbumCard';
import { CardLayout } from '@/components/layout/CardLayout';
import { Loader } from '@/components/ui/Loader';

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Estado del reproductor y catálogo iTunes
  const {
    randomAlbums,
    searchResults,
    searchTerm,
    isSearchActive,
    loading,
    error,
  } = useSelector((state: RootState) => state.player);


  const {
    topSingers,
    topSingersStatus,
    topSingersError,
  } = useSelector((state: RootState) => state.singer);

  // Cancelación de peticiones pendientes
  const searchPromiseRef = useRef<{ abort: () => void } | null>(null);
  const randomPromiseRef = useRef<{ abort: () => void } | null>(null);
  const topSingersPromiseRef = useRef<{ abort: () => void } | null>(null);

  useEffect(() => {
    // Cargar álbumes recomendados iniciales
    if (!isSearchActive && (!randomAlbums || randomAlbums.length === 0)) {
      randomPromiseRef.current?.abort?.();
      randomPromiseRef.current = dispatch(fetchRandomAlbums());
    }

    // Cargar los artistas en tendencia de Deezer si no están en caché
    if (!topSingers || topSingers.length === 0) {
      topSingersPromiseRef.current?.abort?.();
      topSingersPromiseRef.current = dispatch(
        fetchTopArtistsByCountry({ limit: 10 })
      );
    }

    return () => {
      randomPromiseRef.current?.abort?.();
      searchPromiseRef.current?.abort?.();
      topSingersPromiseRef.current?.abort?.();
    };
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTerm = searchTerm.trim();

    if (!cleanTerm) {
      dispatch(clearSearch());
      return;
    }

    dispatch(setIsSearchActive(true));
    searchPromiseRef.current?.abort?.();
    searchPromiseRef.current = dispatch(fetchArtists(cleanTerm));
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value));

    if (value.trim() === '') {
      searchPromiseRef.current?.abort?.();
      dispatch(clearSearch());

      if (!randomAlbums || randomAlbums.length === 0) {
        randomPromiseRef.current?.abort?.();
        randomPromiseRef.current = dispatch(fetchRandomAlbums());
      }
    }
  };

  const itemsToRender = isSearchActive ? searchResults : randomAlbums;

  return (
    <div className="max-w-full mx-auto p-6 space-y-8">
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearch}
        loading={Boolean(loading)}
      />

      {/* SECCIÓN ARTISTAS EN TENDENCIA */}
      {!isSearchActive && (
        <section>
          <div className="flex items-center gap-2 mb-4 ml-6">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-lg sm:text-xl text-white">Artistas en tendencia</h2>
          </div>

          {topSingersStatus === 'loading' && (
            <div className="py-8 flex justify-center">
              <Loader icon={TrendingUp} className='fixed inset-0 z-50 bg-[#121212]'>Cargando artistas en tendencia...</Loader>
            </div>
          )}

          {Boolean(topSingersError) && topSingersStatus === 'failed' && (
            <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-red-300 text-xs ml-6">
              {String(topSingersError)}
            </div>
          )}

          {topSingers && topSingers.length > 0 && (
            <CardLayout>
              {topSingers.map((singer) => (
                <AlbumCard
                  key={`singer-${singer.id}`}
                  to={`/singer/${encodeURIComponent(singer.name)}`}
                  src={singer.picture_big || singer.picture_medium || singer.picture}
                >
                  <span
                    title={singer.name}
                    className="text-sm font-semibold text-white/90 truncate block hover:text-white"
                  >
                    {singer.name}
                  </span>
                  <span className="text-xs text-neutral-400 block mt-0.5">
                    #{singer.position} en Top Hits
                  </span>
                </AlbumCard>
              ))}
            </CardLayout>
          )}
        </section>
      )}

      {/* SECCIÓN 2 ÁLBUMES O RESULTADOS DE BÚSQUEDA */}
      <section>
        {loading && (
          <div className="py-20 flex justify-center">
            <Loader icon={isSearchActive ? Search : Disc3} className='fixed inset-0 z-50 bg-[#121212]'>
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
          <>
            <div className="flex items-center gap-2 mb-4 ml-6">
              <Library className="w-5 h-5 text-red-500" />
              <h2 className="font-bold text-lg sm:text-xl text-white">
                {isSearchActive ? 'Resultados de búsqueda' : 'Álbumes recomendados'}
              </h2>
            </div>

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
          </>
        )}

        {!loading && !error && (!itemsToRender || itemsToRender.length === 0) && (
          <p className="text-neutral-400 text-sm mt-6 text-center py-12">
            {isSearchActive
              ? `No se encontraron resultados para "${searchTerm}".`
              : 'No hay álbumes recomendados disponibles.'}
          </p>
        )}
      </section>
    </div>
  );
};