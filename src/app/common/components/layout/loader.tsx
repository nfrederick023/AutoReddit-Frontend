import * as React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import { useStateSelector } from '../../hooks/useSelector';

const Loader: React.FC<Record<string, never>> = () => {

  const loaderState = useStateSelector((state) => state.dispatchLoaderReducer);

  return (
    <Backdrop
      open={loaderState.isLoading}
    >
      <CircularProgress />
    </Backdrop>
  );
};

export default Loader;
