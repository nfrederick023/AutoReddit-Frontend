import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createPostAPI } from './app/store/services/createPost';
import { dispatchToastReducer } from './app/store/reducers/toastReducer';
import { rtkQueryErrorLogger } from './app/store/middlewares/toastMiddleware';
import { subredditListAPI } from './app/store/services/subredditList';


export const rootReducer = combineReducers ({
      // Add the generated reducer as a specific top-level slice
      [createPostAPI.reducerPath]: createPostAPI.reducer,
      [subredditListAPI.reducerPath]: subredditListAPI.reducer,
      dispatchToastReducer
});

export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([subredditListAPI.middleware, createPostAPI.middleware, rtkQueryErrorLogger]),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
