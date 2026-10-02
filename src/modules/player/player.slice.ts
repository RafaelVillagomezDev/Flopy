import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { artistService } from './services/artist.service';

// ==========================================
// INTERFACES Y TIPOS
// ==========================================

export interface TrackItem {
  wrapperType: 'track';
  artistId: number;
  artistName: string;
  trackId: number;
  trackName: string;
  trackViewUrl: string;
  previewUrl: string;
  artworkUrl100: string;
  releaseDate: string;
  // Campos opcionales del álbum al que pertenece la pista
  collectionId?: number;
  collectionName?: string;
  collectionViewUrl?: string;
  albumArtwork?: string;
}

export interface AlbumItem {
  wrapperType: 'collection';
  collectionId: number;
  collectionName: string;
  artistId: number;
  artistName: string;
  artworkUrl: string; 
  collectionViewUrl: string;
  releaseDate: string;
  trackCount?: number;
}


export type ItunesItem = TrackItem | AlbumItem;

export interface PlayerState {
  currentItem: ItunesItem[] | null;
  isPlaying: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  loading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  currentItem: null,
  isPlaying: false,
  status: 'idle',
  loading: false,
  error: null,
};

// ==========================================
// FUNCIONES ASÍNCRONAS (THUNKS)
// ==========================================

// 1. Busca canciones (API de búsqueda normal de iTunes)
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

// 2. Obtiene álbumes aleatorios (Feed RSS de Top Albums)
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
        // Filtramos para quitar Singles y EPs si solo quieres álbumes completos
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

// ==========================================
// SLICE
// ==========================================

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    resetPlayer: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchArtists
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.currentItem = action.payload; // Guarda Array de TrackItem
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Error al buscar pista';
      })
      // fetchRandomAlbums
      .addCase(fetchRandomAlbums.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRandomAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.currentItem = action.payload; // Guarda Array de AlbumItem
      })
      .addCase(fetchRandomAlbums.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Error al buscar álbumes aleatorios';
      });
  },
});

export const { setIsPlaying, resetPlayer } = playerSlice.actions;

export default playerSlice.reducer;