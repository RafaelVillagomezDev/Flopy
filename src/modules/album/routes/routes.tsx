import { type RouteObject } from 'react-router-dom';
import { Album } from '@modules/album/views/Album';



export const AlbumRoutes: RouteObject = {
  path: 'album',
  children: [
    {
      path: ':collectionId',
      element: <Album /> 
    },
  ]
};