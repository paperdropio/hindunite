import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { AppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { logout } from './api/auth';


export const Header = () => {
    const { isLoggedIn, email, setUserLoggedOut  } = React.useContext(AppContext)
    const navigate = useNavigate();
    const theme = useTheme();

    const handleLogin = () => {
        navigate('/login');
    }

    const handleLogout = async () => {
        await logout();
        setUserLoggedOut();
        navigate('/');
    }

    return (<AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, backgroundColor: `${theme.logoBgColor}` }}
    >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
            <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                <Box
                    component="img"
                    sx={{
                        maxHeight: { xs: 233, md: 167 },
                        maxWidth: { xs: 350, md: 250 },
                    }}
                    alt="Paperdrop logo"
                    src={require("./assets/logo.png")}
                />
            </Typography>
            {isLoggedIn ?
                <Button onClick={handleLogout} variant="outlined" sx={{ my: 1, mx: 1.5, color: 'white', borderColor: 'black' }}>
                    Logout
                </Button> :
                <Button onClick={handleLogin} variant="outlined" sx={{ my: 1, mx: 1.5, color: 'white', borderColor: 'black' }}>
                    Login
                </Button>}
        </Toolbar>
    </AppBar>);
}