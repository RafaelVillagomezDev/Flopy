import type { SearchOptions } from "@/types/searchOptions.type";


export const singerService = {
  searchSingerInfo: (searchTerm: string, options?: SearchOptions) => {
    return {
      url: `https://www.theaudiodb.com/api/v1/json/123/search.php?s=${searchTerm}`,
      options: {
        method: 'GET',
        signal: options?.signal,
      },
    };
  }  
};