import * as React from 'react';
import { Grid, Container } from '@mui/material';

export const Footer = () => {
    return (
        <Container
            maxWidth="md"
            component="footer"
            sx={{
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                mt: 8,
            }}
        >
            <Grid container spacing={4} justifyContent="space-evenly">
            </Grid>
        </Container>
    );
}