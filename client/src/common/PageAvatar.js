import * as React from 'react';
import { Avatar } from '@mui/material';
import { useTheme } from '@emotion/react';

export const PageAvatar = ({ children }) => {
    const theme = useTheme();

    return (<Avatar sx={{ m: 1, bgcolor: `${theme.logoBgColor}` }}>
        {children}
    </Avatar>)
}