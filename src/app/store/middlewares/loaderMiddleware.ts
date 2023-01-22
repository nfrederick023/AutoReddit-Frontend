import { AnyAction, isFulfilled, isRejected } from '@reduxjs/toolkit';
import { QueryThunkArg } from '@reduxjs/toolkit/dist/query/core/buildThunks';
import { displayLoader } from '../actions/loaderAction';
import { store } from '../store';
import type { Middleware } from '@reduxjs/toolkit';

/**
 * Middleware which logs errors on API failures. 
 */
export const loadingSpinnerToggle: Middleware =
    () => (next) => (action: AnyAction) => {

        const endpointName = (action?.meta?.arg as QueryThunkArg)?.endpointName;

        if (endpointName) {

            if (isFulfilled(action) || isRejected(action)) {
                store.dispatch(displayLoader(false));
            } else {
                store.dispatch(displayLoader(true));
            }

        }
        return next(action);
    };