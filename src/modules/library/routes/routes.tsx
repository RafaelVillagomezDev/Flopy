import { type RouteObject } from 'react-router-dom';

import { LibraryHome } from '@modules/library/views/LibraryHome';

export const libraryRoutes: RouteObject = {
  path: 'library',
  children: [
    {
      index: true, // Ruta: /library
      element: <LibraryHome />
    },
  ]
};