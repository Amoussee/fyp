'use client';
import React from 'react';
import { TextField, Box, Grid, Typography } from '@mui/material';
import SchoolSelect from './schoolDropdown'; // Assuming this is your dropdown component

interface SchoolOption {
  school_id: number;
  school_name: string;
}

interface ChildDetailProps {
  index: number;
  childDetail: { name: string; school: string }; // Structure for child detail
  onUpdate: (index: number, detail: { name: string; school: string }) => void; // Function to handle updates
  schools: SchoolOption[]; // Add this to receive the database list from OnboardingForm
}

const ChildDetail: React.FC<ChildDetailProps> = ({ index, childDetail, onUpdate, schools }) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the name directly in the parent state
    onUpdate(index, { ...childDetail, name: e.target.value });
  };

  const handleSchoolChange = (school: string) => {
    // Update the school directly in the parent state
    onUpdate(index, { ...childDetail, school });
  };

  return (
    <Box sx={{ mb: 2, padding: '6px 0', borderRadius: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Child {index + 1} Detail
      </Typography>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Child's name"
            value={childDetail.name} // Use the name from childDetail
            onChange={handleNameChange} // Update on change
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid size={6}>
          {schools && schools.length > 0 ? (
            <SchoolSelect
              schools={schools}
              selectedSchool={childDetail.school}
              onChange={handleSchoolChange}
            />
          ) : (
            <TextField fullWidth label="School" value="No schools available" disabled />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChildDetail;
