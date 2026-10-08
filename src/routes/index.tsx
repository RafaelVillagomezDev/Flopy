import { createBrowserRouter } from 'react-router-dom';

import { libraryRoutes } from '@modules/library/routes/routes';
import { MainLayout } from '@components/layout/MainLayout';
import { AppRRoutes } from '@/modules/player/routes/routes';
import { AlbumRoutes } from '@/modules/album/routes/routes';
import { SingerRoutes } from '@/modules/singer/routes/routes';


export const router = createBrowserRouter([
  {
    path: '/',
    element:  <MainLayout />, // El Layout manda en la raíz
    children: [
      AppRRoutes, 
      libraryRoutes,
      AlbumRoutes, 
      SingerRoutes
    ]
  }
]);