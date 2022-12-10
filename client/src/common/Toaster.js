import { Alert, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';

export const Toaster = ({ message, open, severity = 'success', handleClose }) => {
    
    return (
        <Snackbar open={open} onClose={handleClose} autoHideDuration={6000} key="BOTTOMRIGHT">
            <Alert severity={severity} onClose={handleClose} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}