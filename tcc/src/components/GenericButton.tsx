"use client";

import * as React from 'react';
import { Button } from '@mui/material';

const GenericButton = ({ buttonText = "Click Me", buttonType = "button", onClick }) => {
    return (
        <Button
            type={buttonType} // Set type dynamically
            variant="contained"
            onClick={onClick} // Handle click event
            sx={{
                backgroundColor: 'var(--main-color)',
                color: 'white',
                '&:hover': {
                    backgroundColor: 'var(--main-darker)', // Change on hover
                },
            }}
        >
            {buttonText} {/* Set button text dynamically */}
        </Button>
    );
};

export default GenericButton;