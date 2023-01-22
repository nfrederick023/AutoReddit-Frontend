import * as React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { displayToast } from '../../../store/actions/toastAction';
import { store } from '../../../store/store';
import { useStateSelector } from '../../../hooks/useSelector';

const ToastComponent = (): React.ReactElement<void> => {

  const toastState = useStateSelector((state) => state.dispatchToastReducer);

  return (
    <Snackbar open={toastState.open} autoHideDuration={2000} onClose={(): void => { store.dispatch(displayToast(false, toastState.message, toastState.toastType)); }}>
      <Alert severity={toastState.toastType} sx={{ width: '100%' }}>
        {toastState.message}
      </Alert>
    </Snackbar>
  );
};

export default ToastComponent;
