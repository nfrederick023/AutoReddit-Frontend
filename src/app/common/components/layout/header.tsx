import * as React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header: React.FC<Record<string, never>> = () => {

   return (
      <AppBar position="relative">
         <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
               AutoReddit
            </Typography>
         </Toolbar>
      </AppBar>
   );
};

export default Header;