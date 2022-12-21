import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createPostAPI } from './services/createPost';
import { dispatchLoaderReducer } from './reducers/loaderReducer';
import { dispatchToastReducer } from './reducers/toastReducer';
import { loadingSpinnerToggle } from './middlewares/loaderMiddleware';
import { rtkQueryErrorLogger } from './middlewares/toastMiddleware';
import { subredditListAPI } from './services/subredditList';


export const rootReducer = combineReducers ({
      // Add the generated reducer as a specific top-level slice
      [createPostAPI.reducerPath]: createPostAPI.reducer,
      [subredditListAPI.reducerPath]: subredditListAPI.reducer,
      dispatchToastReducer,
      dispatchLoaderReducer
});

export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([subredditListAPI.middleware, createPostAPI.middleware, rtkQueryErrorLogger, loadingSpinnerToggle]),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
