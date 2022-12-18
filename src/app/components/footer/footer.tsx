import * as React from 'react';
import { Paper, Typography } from '@mui/material';

const Footer: React.FC<Record<string, never>> = () => {

   return (
      <Paper sx={{
         marginTop: 'calc(10% + 60px)',
         position: 'fixed',
         bottom: 0,
         width: '100%'
      }} component="footer" square variant="outlined">
         <Typography sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: 'flex',
            my: 1
         }} variant="caption" >
            Copyright ©2022. LMMCI
         </Typography>
      </Paper>
   );
};

export default Footer;