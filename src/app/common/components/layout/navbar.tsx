import * as React from 'react';
import { AppPage } from '../../interfaces/layout';
import { Box, Divider, Link, Stack, Typography } from '@mui/material';

const appPages: AppPage[] = [
  {
    pageTitle: 'Dashboard',
    pageLink: '/',
  },
  {
    pageTitle: 'Schedule',
    pageLink: '/schedule'
  },
  {
    pageTitle: 'Subreddits',
    pageLink: '/subreddits'
  },
  {
    pageTitle: 'Options',
    pageLink: '/options'
  }
];

const NavBar: React.FC<Record<string, never>> = () => {
  return (
    <>
      <Stack direction="row" spacing={2} >
        {appPages.map((appPage, index) =>
          <Box display='flex' key={appPage.pageTitle}>
            <Typography  >

              <Link
                href={appPage.pageLink}
                underline="none"
                className={window.location.pathname === appPage.pageLink ? 'selectedLink' : 'link'}
              >
                {appPage.pageTitle}

              </Link>
            </Typography>

            {index !== appPages.length - 1 ?
              <Box minHeight="100%" justifyContent="center" ml='16px'
                alignItems="center" sx={{ display: 'flex', alignContent: 'center' }}>
                <Divider orientation='vertical' />
              </Box>
              :
              <></>
            }
          </Box>
        )}

      </Stack>
      <Divider sx={{ width: '100%', marginBottom: 1, marginTop: 1 }} />
    </>
  );
};

export default NavBar;

