import type { SearchOptions } from "@/types/searchOptions.type";


export const artisService = {
  searchArtists: (searchTerm: string, options?: SearchOptions) => ({
    url: `/api/search?q=${encodeURIComponent(searchTerm.trim())}`,
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    },
  }),
};