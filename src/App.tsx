import './App.css';
import * as React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
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
          minHeight: '100vh',
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
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/options" element={<OptionsPage />} />
            <Route path="/subreddits" element={<SubredditsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path='*' element={<ErrorPage />} />
          </Routes>

        </Container>
        <Footer />
      </Container>
      <Loader />
    </ThemeProvider >
  );
};

export default App;
