"use client";

import * as React from 'react';
import { Button } from '@mui/material';

interface GenericButtonProps {
    buttonText?: string;
    buttonType?: 'button' | 'submit' | 'reset';
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}

const GenericButton = ({ buttonText = "Click Me", buttonType = "button", onClick, disabled }: GenericButtonProps) => {
    return (
        <Button
            type={buttonType} // Set type dynamically
            variant="contained"
            onClick={onClick} // Handle click event
            disabled={disabled}
            sx={{
                backgroundColor: 'var(--main-color)',
                color: 'white',
                '&:hover': {
                    backgroundColor: 'var(--main-darker)', // Change on hover
                },
                margin:"12px 0"
            }}
        >
            {buttonText} {/* Set button text dynamically */}
        </Button>
    );
};

export default GenericButton;