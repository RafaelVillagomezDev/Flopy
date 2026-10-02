import type { SearchOptions } from "@/types/searchOptions.type";


export const artistService = {
  searchArtists: (searchTerm: string, options?: SearchOptions) => {
    return {
      url: `https://itunes.apple.com/search?term=${searchTerm}&country=ES&entity=song&limit=10`,
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
  }
  
};