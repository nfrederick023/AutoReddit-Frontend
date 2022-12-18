import * as React from 'react';
import { Typography } from '@mui/material';

const ErrorPage: React.FC<Record<string, never>> = () => {

   return (
      <>
         <Typography
            variant='h2'
         >
            404
         </Typography>
         <Typography
            variant='h5'
         >
            Page Not Found
         </Typography>
      </>
   );
};

export default ErrorPage;