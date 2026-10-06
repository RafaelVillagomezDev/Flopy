import { configureStore } from '@reduxjs/toolkit'
import playerReducer from '@modules/player/player.slice';
import singerReducer from '@/modules/singer/singer.slice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    singer:singerReducer,
    
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store