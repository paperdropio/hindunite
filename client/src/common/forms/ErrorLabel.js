import * as React from 'react'
import { FormLabel } from '@mui/material';

export const ErrorLabel = ({ children })  => {

    return (
        <FormLabel sx={{ fontStyle: 'italic', fontSize: '11px', paddingLeft: '5px' }} error>{children}</FormLabel>
    );
}