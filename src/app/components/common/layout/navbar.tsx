import * as React from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface AppPage {
  pageTitle: string,
  pageLink: string
}

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
    pageTitle: 'Stats',
    pageLink: '/stats'
  },
  {
    pageTitle: 'Options',
    pageLink: '/options'
  }
];

const NavBar: React.FC<Record<string, never>> = () => {

  const navigate = useNavigate();
  return (
    <>
      <Stack direction="row" spacing={2} >
        {appPages.map((appPage, index) =>
          <Box display='flex' key={appPage.pageTitle}>
            <Typography
              onClick={(): void => { navigate(appPage.pageLink); }}
              className={window.location.pathname === appPage.pageLink ? 'selectedLink link' : 'link'}
            >
              {appPage.pageTitle}
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

