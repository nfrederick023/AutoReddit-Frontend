import './App.css';
import * as React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './app/components/error/error';
import Footer from './app/components/footer/footer';
import Header from './app/components/header/header';
import HomePage from './app/components/home/home';
import ToastComponent from './app/common/components/toast';


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
            maxWidth="md"
            sx={{
               justifyContent: 'center',
               paddingTop: '20px',
            }}
         >
            <RouterProvider router={router} />
         </Container>

         {/* 100px paddingBottom Container allows scrolling to the bottom when covered by Footer */}
         <Container sx={{ paddingBottom: '100px' }} />
         <Footer />

      </ThemeProvider >
   );
};

export default App;
