import { configureStore } from '@reduxjs/toolkit';

import youtubeSearch from './youtubeSearchSlice';
import user from './userSlice';
import favorites from './favoritesSlice';
import route from './routeSlice';

export const store = configureStore({
  reducer: {
    youtubeSearch,
    user,
    favorites,
    route,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
