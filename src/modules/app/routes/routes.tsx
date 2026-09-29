import { type RouteObject } from 'react-router-dom';
import { Home } from '../views/Home';



export const AppRRoutes: RouteObject = {
  path: '',
  children: [
    {
      index: true, // Ruta: /library
      element: <Home />
    },
  ]
};