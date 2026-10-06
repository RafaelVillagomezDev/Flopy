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
    type: 'artist';
}


export interface ArtistAlbumItem {
    wrapperType: string;
    collectionType: string;
    artistId: number;
    collectionId: number;
    artistName: string;
    collectionName: string;
    artworkUrl100: string;
    artworkUrl200: string,
    artworkUrl300: string,
    releaseDate: string;
    trackCount: number;
    primaryGenreName: string;
}

export interface SingerState {
    singer: SingerItem | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    loading: boolean;
    error: string | null;

    topSingers: TopSingersItem[] | null;
    topSingersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    topSingersError: string | null;

    // Nuevo estado para la discografía
    artistAlbums: ArtistAlbumItem[] | null;
    albumsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    albumsError: string | null;
}

const initialState: SingerState = {
    singer: null,
    status: 'idle',
    loading: false,
    error: null,

    topSingers: null,
    topSingersStatus: 'idle',
    topSingersError: null,

    artistAlbums: null,
    albumsStatus: 'idle',
    albumsError: null,
};

export interface FetchTopSingersArgs {
    limit?: number;
    chartId?: number | string;
}

interface DeezerArtistsChartResponse {
    data: TopSingersItem[];
    total: number;
}

// THUNKS

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


export const fetchArtistAlbums = createAsyncThunk<
    ArtistAlbumItem[],
    string,
    { rejectValue: string }
>(
    'singer/fetchArtistAlbums',
    async (artistName: string, { rejectWithValue, signal }) => {
        
        const { url, options } = singerService.getAlbumSinger(artistName, { signal });
        try {
            const response = await fetch(url, options);

            if (!response.ok) throw new Error('Error al cargar los álbumes');

            const data = await response.json();

            // Transformamos las URLs de las imágenes a mayor resolución
            const albumsFormatImages = data.results.map((album: any) => {
                if (album.artworkUrl100) {
                    const rawArtwork = album.artworkUrl100;

                    album.artworkUrl200 = rawArtwork
                        .replace(/\d+x\d+bb/g, '200x200bb')
                        .replace(/\d+x\d+/g, '200x200');

                    album.artworkUrl300 = rawArtwork
                        .replace(/\d+x\d+bb/g, '300x300bb')
                        .replace(/\d+x\d+/g, '300x300');
                }
                return album;
            });

            return albumsFormatImages;
        } catch (error: any) {
            if (error.name === 'AbortError') throw error;
            return rejectWithValue(error.message || 'Error al obtener la discografía');
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

            state.artistAlbums = null;
            state.albumsStatus = 'idle';
            state.albumsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchSingerInfo
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
                if (action.meta.aborted) return;
                state.loading = false;
                state.status = 'failed';
                state.singer = null;
                state.error = action.payload || action.error.message || 'Error al buscar artista';
            })

            // fetchTopArtistsByCountry
            .addCase(fetchTopArtistsByCountry.pending, (state) => {
                state.topSingersStatus = 'loading';
                state.topSingersError = null;
            })
            .addCase(fetchTopArtistsByCountry.fulfilled, (state, action) => {
                state.topSingersStatus = 'succeeded';
                state.topSingers = action.payload;
            })
            .addCase(fetchTopArtistsByCountry.rejected, (state, action) => {
                if (action.meta.aborted) return;
                state.topSingersStatus = 'failed';
                state.topSingersError = action.payload || action.error.message || 'Error al cargar artistas populares';
            })

            // fetchArtistAlbums 
            .addCase(fetchArtistAlbums.pending, (state) => {
                state.albumsStatus = 'loading';
                state.albumsError = null;
            })
            .addCase(fetchArtistAlbums.fulfilled, (state, action) => {
                state.albumsStatus = 'succeeded';
                state.artistAlbums = action.payload;
            })
            .addCase(fetchArtistAlbums.rejected, (state, action) => {
                if (action.meta.aborted) return;
                state.albumsStatus = 'failed';
                state.albumsError = action.payload || action.error.message || 'Error al cargar álbumes';
            });
    }
});

export const { clearSinger } = singerSlice.actions;
export default singerSlice.reducer;