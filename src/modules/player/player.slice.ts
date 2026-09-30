import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@store/store'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { artisService } from './services/artist.service';

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

interface AudiobookItem extends BaseMedia {
  wrapperType: 'audiobook';
  collectionId: number;
  collectionName: string;
  collectionViewUrl: string;
  description: string;
  longDescription?: string;
}

// Tipo final para la respuesta dependiendo de respuesta
type ItunesItem = TrackItem | AudiobookItem;


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

    const { url, options } = artisService.searchArtists(searchTerm, { signal });

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        return rejectWithValue(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return (data.results || []) as ItunesItem[];
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Si fue abortada manualmente por una nueva pulsación, relanzamos
        // para que Redux Toolkit marque action.meta.aborted = true
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