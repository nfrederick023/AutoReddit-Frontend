import './App.css';
import * as React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './app/components/error/error';
import Footer from './app/common/components/layout/footer';
import Header from './app/common/components/layout/header';
import HomePage from './app/components/home/home';
import Loader from './app/common/components/layout/loader';
import ToastComponent from './app/common/components/layout/toast';


const App: React.FC<Record<string, never>> = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
      errorElement: <></>,

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

  return (
    <ThemeProvider theme={theme}>

      <CssBaseline />
      <ToastComponent />
      <Header />
      <Container
        disableGutters={true}
        sx={{
          position: 'relative',
          minHeight: '94vh',
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

          <RouterProvider router={router} />

        </Container>
        <Footer />
      </Container>
      <Loader />
    </ThemeProvider >
  );
};

export default App;
