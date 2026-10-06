import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { singerService } from './services/singer.service';
import { fetchDeezerJSONP } from './utils/fetchJSONP';

// INTERFACES Y TIPOS

export interface SingerItem {
    idArtist: string;
    strArtist: string;
    strArtistAlternate?: string | null;
    intFormedYear?: string | null;
    intBornYear?: string | null;
    intPopularity?: string | null;
    strStyle?: string | null;
    strGenre?: string | null;
    strBiographyEN?: string | null;
    strBiographyES?: string | null;
    strGender?: string | null;
    intMembers?: string | null;
    strCountry?: string | null;
    strArtistThumb?: string | null;
    strArtistLogo?: string | null;
    strArtistBanner?: string | null;
}


export interface TopSingersItem {
    id: number;
    name: string;
    link: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    radio: boolean;
    tracklist: string;
    position: number;
    type: 'artist'; // o string si prefieres no restringirlo
}

export interface SingerState {
    singer: SingerItem | null; // Cambiado a un solo objeto
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    loading: boolean;
    error: string | null;
    topSingers: TopSingersItem[] | null;
    topSingersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    topSingersError: string | null;
}



const initialState: SingerState = {
    singer: null,
    status: 'idle',
    loading: false,
    error: null,
    topSingers: null,
    topSingersStatus: 'idle',
    topSingersError: null,

};

export interface FetchTopSingersArgs {
    limit?: number;
    // Opcional: si quieres pasar el ID del chart por país (por defecto 0 es Global/Localizado)
    chartId?: number | string;
}

interface DeezerArtistsChartResponse {
    data: TopSingersItem[];
    total: number;
}

export const fetchTopArtistsByCountry = createAsyncThunk<
    TopSingersItem[],
    FetchTopSingersArgs | void,
    { rejectValue: string }
>(
    'singer/fetchTopArtistsByCountry',
    async (args, { rejectWithValue }) => {
        const limit = args?.limit ?? 10;
        const chartId = args?.chartId ?? 0;

        try {

            const response = await fetchDeezerJSONP<DeezerArtistsChartResponse>({
                endpoint: `chart/${chartId}/artists`,
                params: { limit },
            });

            if (!response || !response.data) {
                return rejectWithValue('No se encontraron artistas en tendencia');
            }

            return response.data;
        } catch (err: any) {
            return rejectWithValue(err?.message || 'Error al obtener los artistas populares');
        }
    }
);


export const fetchSingerInfo = createAsyncThunk<
    SingerItem,
    string,
    { rejectValue: string }
>(
    'singer/fetchSingerInfo',
    async (searchTerm: string, { rejectWithValue, signal }) => {
        const formattedTerm = encodeURIComponent(searchTerm.trim());
        const { url, options } = singerService.searchSingerInfo(formattedTerm, { signal });
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                return rejectWithValue(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            const results = data.artists || data.results;

            if (!results || results.length === 0) {
                return rejectWithValue('No se encontró información del artista');
            }


            return results[0] as SingerItem;
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') throw error;
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Error inesperado al buscar información del artista');
        }
    }
);

export const singerSlice = createSlice({
    name: 'singer',
    initialState,
    reducers: {
        clearSinger: (state) => {
            state.singer = null;
            state.status = 'idle';
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSingerInfo.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
                state.singer = null;
            })
            .addCase(fetchSingerInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.singer = action.payload;
            })
            .addCase(fetchSingerInfo.rejected, (state, action) => {
                if (action.meta.aborted) return; // Si fue abortada intencionalmente, no tocar nada

                state.loading = false;
                state.status = 'failed';
                state.singer = null;
                state.error = action.payload || action.error.message || 'Error al buscar artista';
            })
            .addCase(fetchTopArtistsByCountry.pending, (state) => {
                state.topSingersStatus = 'loading';
                state.topSingersError = null;
            })
            .addCase(
                fetchTopArtistsByCountry.fulfilled,
                (state, action) => {
                    state.topSingersStatus = 'succeeded';
                    state.topSingers = action.payload; 
                }
            )
            .addCase(fetchTopArtistsByCountry.rejected, (state, action) => {
                if (action.meta.aborted) return;

                state.topSingersStatus = 'failed';
                state.topSingersError = action.payload || action.error.message || 'Error al cargar artistas populares';
            });
    }
});

export const { clearSinger } = singerSlice.actions;
export default singerSlice.reducer;