import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from './AppContext';
import { Container, Box, } from '@mui/system';
import { CircularProgress, FormLabel, CssBaseline, Button, TextField } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyEmail } from './api/auth';
import { PageAvatar } from './common/PageAvatar';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ErrorLabel } from './common/forms/ErrorLabel';

const VerificationCodeFormSchema = Yup.object().shape({
    verificationCode: Yup.string().required('Verification code required'),
});

export const VerifyEmail = () => {

    const { id } = useParams();
    const { isLoggedIn, showErrorMessage, showSuccessMessage} = useContext(AppContext);
    const [verificationCode, setVerificationCode] = useState(id);
    const [isLoading, setIsLoading] = useState(false);


    const navigate = useNavigate();

    if (isLoggedIn) {
        navigate('/');
    }

    const confirmVerificationCode = async (verificationCode) => {
        setIsLoading(true);
        const { success, message } = await verifyEmail({ verificationCode });

        if (success) {
            showSuccessMessage(`Thank you for verifying ${message.email}`)
            navigate("/login");
        } else {
            showErrorMessage('Could not verify the email, please confirm the verification code sent in the email');
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (id) {
            const f = async () => {
                await confirmVerificationCode(verificationCode);
            };
            f();
        }
    }, [id]);

    const verificationCodeForm = useFormik({
        initialValues: {
            verificationCode: ''
        },
        validationSchema: VerificationCodeFormSchema,
        onSubmit: async values => {
            await confirmVerificationCode(values.verificationCode);
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
                    <HowToRegIcon />
                </PageAvatar>
                {!verificationCode && !isLoading &&
                    <Box component="form" onSubmit={verificationCodeForm.handleSubmit} noValidate sx={{ mt: 1 }}>
                        <FormLabel>A verification code has been sent to confirm your email, please enter the confirmation code below:</FormLabel>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="verificationCode"
                            label="Verification Code"
                            value={verificationCodeForm.values.verificationCode}
                            onChange={verificationCodeForm.handleChange}
                            autoFocus
                        />
                        {verificationCodeForm.errors.verificationCode && verificationCodeForm.touched.verificationCode &&
                            <ErrorLabel>{verificationCodeForm.errors.verificationCode}</ErrorLabel>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Verify
                        </Button>
                    </Box>
                }
                {isLoading &&
                    <CircularProgress />
                }
            </Box>
        </Container>
    );
}
