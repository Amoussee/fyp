'use client';

import * as React from 'react';
import Button from '@mui/material/Button';

type GenericButtonProps = {
  buttonText?: string;
  buttonType?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const GenericButton: React.FC<GenericButtonProps> = ({
  buttonText = 'Click Me',
  buttonType = 'button',
  onClick,
}) => {
  return (
    <Button
      type={buttonType}
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: 'var(--main-color)',
        color: 'white',
        '&:hover': { backgroundColor: 'var(--main-darker)' },
        margin: '12px 0',
      }}
    >
      {buttonText}
    </Button>
  );
};

export default GenericButton;
