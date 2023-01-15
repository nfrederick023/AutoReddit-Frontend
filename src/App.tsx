import './App.css';
import * as React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import DashboardPage from './app/components/dashboard/dashboard';
import ErrorPage from './app/components/error/error';
import Footer from './app/common/components/layout/footer';
import Header from './app/common/components/layout/header';
import Loader from './app/common/components/layout/loader';
import NavBar from './app/common/components/layout/navbar';
import OptionsPage from './app/components/options/options';
import SchedulePage from './app/components/schedule/schedule';
import SubredditsPage from './app/components/subreddits/subreddits';
import ToastComponent from './app/common/components/layout/toast';

const App: React.FC<Record<string, never>> = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <DashboardPage />,
      errorElement: <></>,

    }, {
      path: '/options',
      element: <OptionsPage />
    }, {
      path: '/subreddits',
      element: <SubredditsPage />
    }, {
      path: '/schedule',
      element: <SchedulePage />
    }, {
      path: '*',
      element: <ErrorPage />
    }
  ]);

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  window.onload = function (): void {
    setTimeout(function () {
      console.log('ran');
      const el = document.getElementById('body');
      if (el) {
        el.style.display = 'inline';
      }
    }, 200);
  };


  return (
    <ThemeProvider theme={theme}>

      <CssBaseline />
      <ToastComponent />
      <Header />
      <Container
        id="body"
        disableGutters={true}
        sx={{
          display: 'none',
          position: 'relative',
          minHeight: '99vh',
          minWidth: '100vw',
          pl: '0px'
        }}>

        <Container
          maxWidth="lg"
          sx={{
            pb: '100px',
            pt: '20px',
          }}
        >
          <NavBar />
          <RouterProvider router={router} />

        </Container>
        <Footer />
      </Container>
      <Loader />
    </ThemeProvider >
  );
};

export default App;
