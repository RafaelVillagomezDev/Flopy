import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { artistService } from './services/artist.service';
import type { TrackItem } from '@/types/track.type';
import type { AlbumItem } from '@/types/album.type';

// INTERFACES Y TIPOS


export type ItunesItem = TrackItem | AlbumItem;

export interface PlayerState {
  // Catálogo de búsqueda / feed
  searchResults: ItunesItem[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  loading: boolean;
  error: string | null;
  // Catalogo de pistas de un álbum específico
  albumTracks: TrackItem[] | null;
  randomAlbums: ItunesItem[] | null;
  queue: TrackItem[];

  // Estado del Reproductor en tiempo real
  currentTrack: TrackItem | null;
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  seekTime: number | null;
  volume: number;
  searchTerm: string;
  isSearchActive: boolean;
  
  // Controles de Aleatorio (Shuffle)
  isShuffle: boolean;
  shuffleHistory: number[];
  playedHistory: number[];
}

const initialState: PlayerState = {
  searchResults: null,
  status: 'idle',
  loading: false,
  error: null,
  albumTracks: null,
  currentTrack: null,
  isPlaying: false,
  isMuted: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  seekTime: null,
  searchTerm: '',
  isSearchActive: false,
  randomAlbums: null,
  queue: [],
  isShuffle: false,
  shuffleHistory: [],
  playedHistory: [],
};


// THUNKS ASYNC

export const fetchArtists = createAsyncThunk<
  ItunesItem[],
  string,
  { rejectValue: string }
>(
  'artist/fetchArtists',
  async (searchTerm: string, { signal, rejectWithValue }) => {
    const { url, options } = artistService.searchArtists(searchTerm, { signal });

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        return rejectWithValue(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const rawResults = (data.results || []) as any[];

      const formattedResults: TrackItem[] = rawResults.map((item) => {
        const rawArtwork = item.artworkUrl100 || '';
        const artwork200 = rawArtwork
          ? rawArtwork.replace(/\d+x\d+bb/g, '200x200bb').replace(/\d+x\d+/g, '200x200')
          : '';

        return {
          wrapperType: 'track' as const,
          artistId: item.artistId || 0,
          artistName: item.artistName || 'Artista desconocido',
          trackId: item.trackId || 0,
          trackName: item.trackName || 'Canción',
          trackViewUrl: item.trackViewUrl || '',
          releaseDate: item.releaseDate || '',
          artworkUrl100: artwork200,
          previewUrl: item.previewUrl || '',
          collectionId: item.collectionId,
          collectionName: item.collectionName || 'Álbum desconocido',
          collectionViewUrl: item.collectionViewUrl || '',
          albumArtwork: artwork200,
        };
      });

      return formattedResults;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw error;
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error inesperado al buscar canciones');
    }
  }
);

export const fetchRandomAlbums = createAsyncThunk<
  ItunesItem[],
  void,
  { rejectValue: string }
>(
  'artist/fetchRandomAlbums',
  async (_, { signal, rejectWithValue }) => {
    const { url, options } = artistService.getRandomAlbums({ signal });

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        return rejectWithValue(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const entries = data.feed?.entry || [];

      const formattedResults: AlbumItem[] = entries
        .filter((entry: any) => !/\s*-\s*(ep|single)\s*$/i.test(entry['im:name']?.label || ''))
        .map((entry: any) => {
          const rawArtwork = entry['im:image']?.[2]?.label || entry['im:image']?.[0]?.label || '';
          const artwork200 = rawArtwork
            .replace(/\d+x\d+bb/g, '200x200bb')
            .replace(/\d+x\d+/g, '200x200');

          const collectionHref = entry.link?.attributes?.href || '';
          const collectionId = Number(entry.id?.attributes?.['im:id'] || collectionHref.split('/id')?.[1]?.split('?')?.[0] || 0);

          const artistHref = entry['im:artist']?.attributes?.href || '';
          const artistId = Number(artistHref.split('/id')?.[1]?.split('?')?.[0] || 0);

          return {
            wrapperType: 'collection' as const,
            collectionId,
            collectionName: entry['im:name']?.label || 'Álbum desconocido',
            artistId,
            artistName: entry['im:artist']?.label || 'Artista desconocido',
            artworkUrl: artwork200,
            collectionViewUrl: collectionHref,
            releaseDate: entry['im:releaseDate']?.label || '',
            trackCount: Number(entry['im:itemCount']?.label || 0),
          };
        });

      return formattedResults;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw error;
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error inesperado al buscar álbumes aleatorios');
    }
  }
);

export const fetchAlbumTracks = createAsyncThunk<
  TrackItem[],
  number,
  { rejectValue: string }
>(
  'player/fetchAlbumTracks',
  async (collectionId: number, { signal, rejectWithValue }) => {
    const { url, options } = artistService.getAlbumTracks(collectionId, { signal });

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        return rejectWithValue(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const results = (data.results || []) as any[];

      const tracks: TrackItem[] = results
        .filter((item) => item.wrapperType === 'track' && Boolean(item.previewUrl))
        .map((item) => {
          const rawArtwork = item.artworkUrl100 || '';
          const artwork200 = rawArtwork
            ? rawArtwork.replace(/\d+x\d+bb/g, '200x200bb').replace(/\d+x\d+/g, '200x200')
            : '';

          return {
            wrapperType: 'track' as const,
            artistId: item.artistId || 0,
            artistName: item.artistName || 'Artista desconocido',
            trackId: item.trackId,
            trackName: item.trackName || 'Pista sin título',
            trackViewUrl: item.trackViewUrl || '',
            releaseDate: item.releaseDate || '',
            artworkUrl100: artwork200,
            previewUrl: item.previewUrl,
            collectionId: item.collectionId,
            collectionName: item.collectionName || 'Álbum',
            collectionViewUrl: item.collectionViewUrl || '',
            albumArtwork: artwork200,
          };
        });

      return tracks;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw error;
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error al cargar las canciones del álbum');
    }
  }
);


// SLICE CON ACCIONES MULTIMEDIA


export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
  
    setCurrentTrack: (
      state,
      action: PayloadAction<{ track: TrackItem; queue?: TrackItem[] } | TrackItem>
    ) => {
      if ('track' in action.payload) {
        state.currentTrack = action.payload.track;
        if (action.payload.queue && action.payload.queue.length > 0) {
          state.queue = action.payload.queue; 
        }
      } else {
        state.currentTrack = action.payload;
      }

      // Sincronizar identificadores de aleatorio con la nueva canción
      if (state.currentTrack) {
        state.shuffleHistory = [state.currentTrack.trackId];
        state.playedHistory = [state.currentTrack.trackId];
      }

      state.isPlaying = true;
      state.currentTime = 0;
      state.seekTime = null;
    },

    togglePlay: (state) => {
      if (state.currentTrack) {
        state.isPlaying = !state.isPlaying;
      }
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },

    setVolume: (state, action: PayloadAction<number>) => {
      const safeVolume = Math.max(0, Math.min(1, action.payload));
      state.volume = safeVolume;
      if (safeVolume > 0 && state.isMuted) {
        state.isMuted = false;
      }
    },

    clearSearch: (state) => {
      state.searchTerm = '';
      state.isSearchActive = false;
      state.searchResults = null;
      state.error = null;
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setIsSearchActive: (state, action: PayloadAction<boolean>) => {
      state.isSearchActive = action.payload;
    },
    resetSearch: (state) => {
      state.searchTerm = '';
      state.isSearchActive = false;
    },
 
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
   
    setTimeUpdate: (state, action: PayloadAction<{ currentTime: number; duration: number }>) => {
      state.currentTime = action.payload.currentTime;
      state.duration = action.payload.duration;
    },
    
    requestSeek: (state, action: PayloadAction<number>) => {
      state.seekTime = action.payload;
    },
    resetSeek: (state) => {
      state.seekTime = null;
    },
    resetPlayer: () => initialState,


    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;

      if (state.isShuffle && state.currentTrack) {
        state.shuffleHistory = [state.currentTrack.trackId];
        state.playedHistory = [state.currentTrack.trackId];
      } else {
        state.shuffleHistory = [];
        state.playedHistory = [];
      }
    },

    playNextTrack: (state) => {
      if (!state.currentTrack || state.queue.length === 0) return;

      // MODO SHUFFLE
      if (state.isShuffle) {
        if (state.queue.length === 1) {
          state.currentTime = 0;
          state.seekTime = 0;
          return;
        }

        let availableTracks = state.queue.filter(
          (track) => !state.playedHistory.includes(track.trackId)
        );

        if (availableTracks.length === 0) {
          state.playedHistory = [state.currentTrack.trackId];
          availableTracks = state.queue.filter(
            (track) => track.trackId !== state.currentTrack?.trackId
          );
        }

        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        const nextTrack = availableTracks[randomIndex];

        state.playedHistory.push(nextTrack.trackId);
        state.shuffleHistory.push(nextTrack.trackId);

        state.currentTrack = nextTrack;
      } 
      else {
        const currentIndex = state.queue.findIndex(
          (track) => track.trackId === state.currentTrack?.trackId
        );
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % state.queue.length;
        state.currentTrack = state.queue[nextIndex];
      }

      state.isPlaying = true;
      state.currentTime = 0;
      state.seekTime = null;
    },

    playPreviousTrack: (state) => {
      if (!state.currentTrack || state.queue.length === 0) return;

      // Reinicio común si lleva > 3s reproduciéndose
      if (state.currentTime > 3) {
        state.currentTime = 0;
        state.seekTime = 0;
        return;
      }

      // MODO SHUFFLE
      if (state.isShuffle) {
        if (state.shuffleHistory.length > 1) {
          state.shuffleHistory.pop(); 
          const previousTrackId = state.shuffleHistory[state.shuffleHistory.length - 1];

          const previousTrack = state.queue.find((t) => t.trackId === previousTrackId);
          if (previousTrack) {
            state.currentTrack = previousTrack;
          }
        } else {
          state.currentTime = 0;
          state.seekTime = 0;
          return;
        }
      } 
      // MODO SECUENCIAL
      else {
        const currentIndex = state.queue.findIndex(
          (track) => track.trackId === state.currentTrack?.trackId
        );
        const prevIndex =
          currentIndex === -1
            ? 0
            : (currentIndex - 1 + state.queue.length) % state.queue.length;

        state.currentTrack = state.queue[prevIndex];
      }

      state.isPlaying = true;
      state.currentTime = 0;
      state.seekTime = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.searchResults = action.payload;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Error al buscar pista';
      })
      .addCase(fetchRandomAlbums.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRandomAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.randomAlbums = action.payload;
      })
      .addCase(fetchRandomAlbums.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Error al buscar álbumes aleatorios';
      })
      .addCase(fetchAlbumTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbumTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.albumTracks = action.payload;
      })
      .addCase(fetchAlbumTracks.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.error = action.payload || 'Error al cargar pistas';
      });
  },
});

export const {
  setCurrentTrack,
  setVolume,
  togglePlay,
  setIsPlaying,
  toggleMute,
  setTimeUpdate,
  requestSeek,
  resetSeek,
  resetPlayer,
  setSearchTerm,
  setIsSearchActive,
  resetSearch,
  clearSearch,
  playNextTrack,
  playPreviousTrack,
  toggleShuffle 
} = playerSlice.actions;

export default playerSlice.reducer;