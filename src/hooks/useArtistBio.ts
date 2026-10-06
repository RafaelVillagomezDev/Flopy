// hooks/useArtistBio.ts
import { useEffect } from 'react';
import type { RootState } from '@/store/store';
import { fetchSingerInfo, clearSinger } from '@modules/singer/singer.slice';
import { useAppDispatch, useAppSelector } from './hooks';

export const useArtistBio = (artistName?: string) => {
  const dispatch = useAppDispatch();
  
  const { singer, status, error } = useAppSelector((state: RootState) => state.singer);
  
  useEffect(() => {
    if (!artistName) {
      dispatch(clearSinger());
      return;
    }

    const promise = dispatch(fetchSingerInfo(artistName));
    return () => {
      promise.abort();
    };
  }, [artistName, dispatch]);


  const isLoading = status === 'loading';


  return { 
    singer,
    status,
    isLoading,
    error 
  };
};