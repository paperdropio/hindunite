import React, { useContext } from 'react'
import { AppContext } from './AppContext';
import { Container, Box, } from '@mui/system';
import { Typography, CssBaseline, TextField, Button, Grid, Link, FormLabel } from '@mui/material';
import { AppRegistration } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { PageAvatar } from './common/PageAvatar';
import { registerUser } from './api/auth';
import { ErrorLabel } from './common/forms/ErrorLabel'

const SignupSchema = Yup.object().shape({

    email: Yup.string().email('Invalid email').required('Email required'),
    password: Yup.string().required('Password required'),
    name: Yup.string().required('Name required'),
});


export const Signup = () => {
    const { isLoggedIn, setEmail, showSuccessMessage, showErrorMessage } = useContext(AppContext);

    const navigate = useNavigate();

    if (isLoggedIn) {
        navigate('/');
    }

    const loginForm = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: SignupSchema,
        onSubmit: async (values, { setErrors }) => {
            const {success, message} = await registerUser(values);
            if (success) {
                showSuccessMessage('User created successfully');
                setEmail(values.email);
                navigate(`/verifyEmail`);
            } else {
                if (message){
                    setErrors({'email': 'Email already registered'});
                }

                showErrorMessage('User could not be created successfully');
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
                    <AppRegistration />
                </PageAvatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" onSubmit={loginForm.handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="name"
                        label="Name"
                        autoComplete="name"
                        value={loginForm.values.name}
                        onChange={loginForm.handleChange}
                        autoFocus
                    />
                    {loginForm.errors.name && loginForm.touched.name &&
                        <ErrorLabel>{loginForm.errors.name}</ErrorLabel>}
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
                        <ErrorLabel>{loginForm.errors.email}</ErrorLabel>}
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
                        <div><ErrorLabel>{loginForm.errors.password}</ErrorLabel></div>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                {"Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
