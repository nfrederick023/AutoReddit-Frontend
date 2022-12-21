import {AnyAction, isFulfilled} from '@reduxjs/toolkit';
import { QueryThunkArg } from '@reduxjs/toolkit/dist/query/core/buildThunks';
import { ToastTypes } from '../../common/interfaces/toast';
import { displayToast } from '../actions/toastAction';
import {store } from '../store';
import type { Middleware } from '@reduxjs/toolkit';

/**
 * Middleware which logs errors on API failures. 
 */
export const rtkQueryErrorLogger: Middleware =
  () => (next) => (action:  AnyAction) => {

   const endpointName = (action?.meta?.arg as QueryThunkArg)?.endpointName;
   const status: string = action?.meta?.requestStatus; 

   if (action.type !== 'dispatchToast' && endpointName && status !== 'pending')  {
      
      if(isFulfilled(action)) {
         //store.dispatch(displayToast(true, `${endpointName} success!`, ToastTypes.Success));
      } else {
         store.dispatch(displayToast(true, `${endpointName} failed.`, ToastTypes.Error));
      }

   }
    return next(action);
  };