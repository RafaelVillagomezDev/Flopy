import { useFetch } from '@/hooks/useFetch';
import type { SearchOptions } from '@/types/searchOptions.type';
import React, { useCallback } from 'react';

// const { data, loading, execute, abort, reset } = useFetch<SearchOptions>

export const Home: React.FC = () => {

  const handleSearch = useCallback(async () => {
    try {
          
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return; // Petición cancelada, no hacemos nada
        }
        console.error('Error:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
    }
  }, []);

  return (
    <div className=" bg-brand-surface min-h-screen">
      <h1>pepe</h1>
    </div>

  );
};