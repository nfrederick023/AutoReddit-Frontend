import { LoaderState } from '../../utils/types';
import { createAction } from '@reduxjs/toolkit';

export const displayLoader = createAction('dispatchLoader', (isLoading: boolean) => {
    const payload: LoaderState = { isLoading };
    return { payload };
});