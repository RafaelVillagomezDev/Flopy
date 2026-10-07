import type { SearchOptions } from "@/types/searchOptions.type";

const BASE_URL = '/api-itunes';

export const artistService = {
  searchArtists: (searchTerm: string, options?: SearchOptions) => {
    const encodedTerm = encodeURIComponent(searchTerm.trim());
    const limit = options?.limit ?? 20;

    return {
      url: `${BASE_URL}/search?term=${encodedTerm}&media=music&entity=song&limit=${limit}&country=ES`,
      options: {
        method: 'GET' as const,
        headers: {
          Accept: 'application/json',
        },
        signal: options?.signal,
      },
    };
  },

  getRandomAlbums: (options?: SearchOptions) => {
    const limit = options?.limit ?? 50;

    return {
      url: `${BASE_URL}/es/rss/topalbums/limit=${limit}/json`,
      options: {
        method: 'GET' as const,
        headers: {
          Accept: 'application/json',
        },
        signal: options?.signal,
      },
    };
  },

  getAlbumTracks: (collectionId: number, options?: { signal?: AbortSignal }) => {
    return {
      url: `${BASE_URL}/lookup?id=${collectionId}&entity=song&country=ES`,
      options: {
        method: 'GET' as const,
        headers: {
          Accept: 'application/json',
        },
        signal: options?.signal,
      },
    };
  },

  getAlbumsByArtist: (
    artistId: number,
    options?: { limit?: number; signal?: AbortSignal }
  ) => {
    const limit = options?.limit ?? 50;

    return {
      url: `${BASE_URL}/lookup?id=${artistId}&entity=album&limit=${limit}&country=ES`,
      options: {
        method: 'GET' as const,
        headers: {
          Accept: 'application/json',
        },
        signal: options?.signal,
      },
    };
  },
};