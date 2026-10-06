import { type RouteObject } from 'react-router-dom';
import { Singer } from '@modules/singer/views/Singer';




export const SingerRoutes: RouteObject = {
  path: 'singer',
  children: [
    {
      path: ':singerName',
      element: <Singer/>
    },
  ]
};