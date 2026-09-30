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
type ItunesItem = TrackItem ;


export interface PlayerState {
  currentItem: ItunesItem[] | null;
  isPlaying: boolean;
  status: 'idle' | 'loading' | 'failed';
  loading:true|false|unknown,
  error:string |null | unknown
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

 export const playerSlice=createSlice({
    name:'player',
    initialState,
    reducers: {

    },
    extraReducers:(builder)=>{
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
    }
 })

 export default playerSlice.reducer;