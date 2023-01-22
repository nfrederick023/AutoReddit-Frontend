import { LoaderState } from '../../utils/types';
import { createAction, createReducer } from '@reduxjs/toolkit';

const dispatchToast = createAction<LoaderState>('dispatchLoader');

const initialState: LoaderState = { isLoading: false };

export const dispatchLoaderReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(dispatchToast, (state: LoaderState, action) => {
            state.isLoading = action.payload.isLoading;
        });
});