import { LoaderState } from '../../common/interfaces/loader';
import { ToastState } from '../../common/interfaces/toast';
import { createAction, createReducer } from '@reduxjs/toolkit';

const dispatchToast = createAction<LoaderState>('dispatchLoader');

const initialState: LoaderState = { isLoading: false };

export const dispatchLoaderReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(dispatchToast, (state, action) => {
      state.isLoading = action.payload.isLoading;
    });
});