import React, { useState } from 'react'
import { Stack, Box, Grid, ThemeProvider, createTheme } from '@mui/material';
import './App.css';
import { AppContext } from './AppContext';
import { Home } from './Home';
import { Login } from './Login';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Header } from './Header';
import { Footer } from './Footer';
import { Signup } from './Signup';
import { VerifyEmail } from './VerifyEmail';
import { Toaster } from './common/Toaster';

export const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [state, setState] = useState({
    toasterShow: false,
    toasterMessage: "",
    toasterSeverity: 'success'
  });
  const [email, setEmail] = useState(null);

  const setUserLoggedIn = (email) => {
    setIsLoggedIn(true);
    setEmail(email);
  }

  const setUserLoggedOut = () => {
    setIsLoggedIn(false);
    setEmail(null);
  }

  const showSuccessMessage = (message) => {
    setState({...state, toasterSeverity: 'success', toasterMessage: message, toasterShow: true});
  }

  const showErrorMessage = (message) => {
    setState({...state, toasterSeverity: 'error', toasterMessage: message, toasterShow: true});
  }

  const showWarningMessage = (message) => {
    setState({...state, toasterSeverity: 'warning', toasterMessage: message, toasterShow: true});
  }

  const handleToasterClose = () => {
    setState({...state, toasterShow: false});
  }

  const baseContext = {
    isLoggedIn,
    email,
    setEmail,
    setUserLoggedIn,
    setUserLoggedOut,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage
  }

  const theme = createTheme({
    logoBgColor: '#BA3B0A',
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContext.Provider value={baseContext}>
          <Box>
            <Header />
            <Toaster open={state.toasterShow} handleClose={handleToasterClose} message={state.toasterMessage} severity={state.toasterSeverity} />
            <Stack spacing={2} sx={{ padding: '20px' }}>
              <Box>
                <Grid
                  container
                  direction="column"
                  justifyContent="center">

                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/verifyEmail/:code?" element={<VerifyEmail />} />
                    <Route path="/verifyEmail" element={<VerifyEmail />} />
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/home" element={<Home />} />
                  </Routes>

                  <Footer />
                </Grid>
              </Box>
            </Stack>
          </Box>
        </AppContext.Provider>
      </Router>
    </ThemeProvider>
  );
}