import { ToastState, ToastTypes } from '../../utils/types';
import { createAction } from '@reduxjs/toolkit';

export const displayToast = createAction('dispatchToast', (open: boolean, message: string, toastType: ToastTypes) => {

    const payload: ToastState = {
        open,
        message,
        toastType
    };

    return { payload };
});