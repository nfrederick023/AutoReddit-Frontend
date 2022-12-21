import { ToastState, ToastTypes } from '../../common/interfaces/toast';
import { createAction } from '@reduxjs/toolkit';

export const displayToast = createAction('dispatchToast', ( open: boolean, message: string, toastType: ToastTypes) => {

   const payload: ToastState = {
         open,
         message,
         toastType
   };

  return { payload };
});