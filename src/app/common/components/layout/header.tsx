import * as React from 'react';
import { AppBar, Divider, Stack, Toolbar, Typography } from '@mui/material';
import { Container } from '@mui/system';

const Header: React.FC<Record<string, never>> = () => {

  return (
    <>
      {/* <AppBar color='transparent' position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Container sx={{ mb: '10px' }} />
    </>
  );
};

export default Header;