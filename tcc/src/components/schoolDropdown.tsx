'use client';
import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// Define what a school object looks like from your DB
interface SchoolOption {
  school_id: number;
  school_name: string;
}

interface SchoolSelectProps {
  schools: SchoolOption[]; // Received from Parent (OnboardingForm)
  selectedSchool: string;  // The current value
  onChange: (school: string) => void; 
}

const SchoolSelect: React.FC<SchoolSelectProps> = ({ schools, selectedSchool, onChange }) => {
  
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id='school-select-label'>Select School</InputLabel>
        <Select
          labelId='school-select-label'
          id='school-select'
          value={selectedSchool}
          label='Select School'
          onChange={handleChange}
          // Adding a max-height to the dropdown menu so it doesn't cover the whole screen
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300, 
              },
            },
          }}
        >
          {/* Default empty option */}
          <MenuItem value="">
            <em>None</em>
          </MenuItem>

          {/* Map through the actual database schools */}
          {schools.map((school) => (
            <MenuItem key={school.school_id} value={school.school_name}>
              {school.school_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SchoolSelect;
