import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { artistService } from './services/artist.service';

interface BaseMedia {
  artistId: number;
  artistName: string;
  releaseDate: string;
  artworkUrl100: string;
  previewUrl: string;
}

interface TrackItem extends BaseMedia {
  wrapperType: 'track';
  trackId: number;
  trackName: string;
  trackViewUrl: string;
  collectionName?: string;
}



// Tipo final para la respuesta dependiendo de respuesta
type ItunesItem = TrackItem;


export interface PlayerState {
  currentItem: ItunesItem[] | null;
  isPlaying: boolean;
  status: 'idle' | 'loading' | 'failed';
  loading: true | false | unknown,
  error: string | null | unknown
}

const initialState: PlayerState = {
  currentItem: null,
  isPlaying: false,
  status: 'idle',
  loading: undefined,
  error: null
};

// FUNCIONES ASINCRONAS MANEJADAS POR REDUX TOOLKIT

export const fetchArtists = createAsyncThunk(
  'artist/fetchArtists',
  async (searchTerm: string, { signal, rejectWithValue }) => {
    const { url, options } = artistService.searchArtists(searchTerm, { signal });

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        return rejectWithValue(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const rawResults = (data.results || []) as ItunesItem[];

      // Mapeamos los resultados sustituyendo la resolución en la URL del artwork
      const formattedResults: ItunesItem[] = rawResults.map((item) => ({
        ...item,
        artworkUrl100: item.artworkUrl100
          ? item.artworkUrl100.replace(/100x100/g, '200x200')
          : item.artworkUrl100,
      }));

      return formattedResults;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw error;
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error inesperado al buscar canciones');
    }
  }
);


export const fetchRandomSongs = createAsyncThunk(
  'artist/fetchRandomSongs',
  async (_, { signal, rejectWithValue }) => {
    const { url, options } = artistService.getRandomSongs({ signal });

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        return rejectWithValue(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const entries = data.feed?.entry || [];

      // Mapeamos el feed RSS 
      const formattedResults: ItunesItem[] = entries.map((entry: any) => {

        const rawArtwork = entry['im:image']?.[2]?.label || entry['im:image']?.[0]?.label || '';

        return {
          wrapperType: 'track' as const,
          artistId: Number(entry['im:artist']?.attributes?.href?.split('/id')?.[1]?.split('?')?.[0] || 0),
          artistName: entry['im:artist']?.label || 'Artista desconocido',
          trackId: Number(entry.id?.attributes?.['im:id'] || 0),
          trackName: entry['im:name']?.label || 'Canción',
          trackViewUrl: entry.link?.[0]?.attributes?.href || '',
          releaseDate: entry['im:releaseDate']?.label || '',
          artworkUrl100: rawArtwork.replace(/\d+x\d+bb/g, '200x200bb').replace(/170x170/g, '200x200'),
          previewUrl: entry.link?.[1]?.attributes?.href || '',
        };
      });


      return formattedResults;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw error;
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error inesperado al buscar canciones aleatorias');
    }
  }
);

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al buscar pista';
      });
    builder
      .addCase(fetchRandomSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRandomSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchRandomSongs.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || null;
      });
  }
})

export default playerSlice.reducer;