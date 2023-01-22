import { Dispatch, SetStateAction } from 'react';
import { debounce } from 'lodash';

/**
 * A function that delays setState to prevent poor preformance. 
 * @param newValue the value being updated
 * @param setAction the setState action
 */
export const debouncedSetState = <T,>(newValue: T, setAction: Dispatch<SetStateAction<T>> | ((...args: T[]) => void)): void => {
    debounce(() => { setAction(newValue); }, 10)();
};