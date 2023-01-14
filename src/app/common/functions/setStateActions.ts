import { Dispatch, SetStateAction } from 'react';
import { debounce } from 'lodash';

export const debouncedSetState = <T,>(newValue: T, setAction: Dispatch<SetStateAction<T>> | ((...args: T[]) => void)): void => {
  debounce(() => { setAction(newValue); }, 10)();
};