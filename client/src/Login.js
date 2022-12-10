import React, { useContext, useState } from 'react'
import { AppContext } from './AppContext';
import { Container, Box, } from '@mui/system';
import { Typography, CssBaseline, Avatar, TextField, Button, Grid, Link, Checkbox, FormControlLabel, FormLabel } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { login } from './api/auth'
import { PageAvatar } from './common/PageAvatar';
import { ErrorLabel } from './common/forms/ErrorLabel';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email required'),
    password: Yup.string().required('Password required'),
});

export const Login = () => {

    const { isLoggedIn, setUserLoggedIn } = useContext(AppContext);

    const navigate = useNavigate();

    if (isLoggedIn) {
        navigate('/');
    }

    const theme = useTheme();

    const loginForm = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: async values => {
            const success = await login(values);
            console.log(success);
            if ( success)
            {
                setUserLoggedIn(values.email);
                navigate('/');
            }
        }
    })

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <PageAvatar>
                    <LockOutlined />
                </PageAvatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={loginForm.handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Email Address"
                        autoComplete="email"
                        value={loginForm.values.email}
                        onChange={loginForm.handleChange}
                        autoFocus
                    />
                    {loginForm.errors.email && loginForm.touched.email && 
                      <ErrorLabel>{loginForm.errors.email}</ErrorLabel> }
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        value={loginForm.values.password}
                        onChange={loginForm.handleChange}
                        autoComplete="current-password"
                    />
                    {loginForm.errors.password && loginForm.touched.password && 
                      <div><ErrorLabel>{loginForm.errors.password}</ErrorLabel></div> }
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
