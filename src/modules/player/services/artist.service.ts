import type { SearchOptions } from "@/types/searchOptions.type";


export const artistService = {
  searchArtists: (searchTerm: string, options?: SearchOptions) => {
    return {
      url: `https://itunes.apple.com/search?term=${searchTerm}&media=music&entity=song&limit=20`,
      options: {
        method: 'GET',
        signal: options?.signal,
      },
    };
  },
  getRandomAlbums: (options?: SearchOptions) => {
    return {
      url: `https://itunes.apple.com/es/rss/topalbums/limit=50/json`,
      options: {
        method: 'GET',
        signal: options?.signal,
      },
    };
  },
  getAlbumTracks: (collectionId: number, options?: { signal?: AbortSignal }) => {
    return {
      url: `https://itunes.apple.com/lookup?id=${collectionId}&entity=song`,
      options: {
        method: 'GET',
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
      url: `https://itunes.apple.com/lookup?id=${artistId}&entity=album&limit=${limit}`,
      options: {
        method: 'GET' as const,
        signal: options?.signal,
      },
    };
  },

};