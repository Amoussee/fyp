import React from 'react'
import { MuiTelInput } from 'mui-tel-input'
import { SxProps, Theme } from '@mui/material'; 

interface PhoneNumberProps {
  value: string;
  onChange: (newValue: string) => void;
  error?: boolean;
  label?: string; // Add this prop
  helperText?: string;
  required?: boolean;
  sx?: SxProps<Theme>; // Optionally add sx prop to allow external styling
}

const PhoneNumber = ({ value, onChange, error, helperText, label,required,sx }: PhoneNumberProps) => {
  return (
    <MuiTelInput
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      label={label} // Pass the label prop here
      fullWidth
      required={required}
      sx={sx} // Use passed sx prop or default
    />
  )
}

export default PhoneNumber
