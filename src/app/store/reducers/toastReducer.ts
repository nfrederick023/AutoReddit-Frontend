import { ToastState, ToastTypes } from '../../utils/types';
import { createAction, createReducer } from '@reduxjs/toolkit';

const dispatchToast = createAction<ToastState>('dispatchToast');

const initialState: ToastState = { open: false, message: '', toastType: ToastTypes.Success };

export const dispatchToastReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(dispatchToast, (state, action) => {
            state.open = action.payload.open;
            state.message = action.payload.message;
            state.toastType = action.payload.toastType;
        });
});