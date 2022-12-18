import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from '../../../store';

/**
 * A hook that is properly typed for RootState 
 */
export const useStateSelector: TypedUseSelectorHook<RootState> = useSelector;