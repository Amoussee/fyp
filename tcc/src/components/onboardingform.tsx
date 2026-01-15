// src/components/OnboardingForm.js
'use client';
import React from 'react';
import { TextField, Box, Grid, Typography } from '@mui/material';
import GenericButton from './GenericButton';
import Numberfield from './Numberfields';
import ChildDetail from './ChildDetails';
import Divider from '@mui/material/Divider';

interface ChildDetail {
    name: string; // Child's name
    school: string; // Selected school
}

const OnboardingForm = () => {
  const [streetName, setStreetName] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');
  const [buildingName, setBuildingName] = React.useState('');
  const [unitNumber, setUnitNo] = React.useState('');
  const [numberChild, setNumberChild] = React.useState<number | null>(null);
  const [childDetails, setChildDetails] = React.useState<ChildDetail[]>([]);
  const [error, setError] = React.useState('');

//   const addChildDetail = () => {
//     setChildDetails([...childDetails, { name: '', school: '' }]); // Add a new child detail entry
//   };

  const updateChildDetail = (index: number, detail: { name: string; school: string }) => {
    const updatedDetails = [...childDetails];
    updatedDetails[index] = detail; // Update specific child's detail
    setChildDetails(updatedDetails);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Child Detail', childDetails)
    setError('');

    if (!numberChild) {
      setError('Please enter a number.');
      console.log(numberChild);
      console.log(error);
      return;
    }

    console.log(error);

    const formData = {
      streetName,
      postalCode,
      buildingName,
      unitNumber,
      numberChild: numberChild?.toString() || '',
      childDetails
    };

    console.log(formData);

    try {
      const response = await fetch('http://localhost:5001/api/submit', { // Full backend URL
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
      });
      if (!response.ok) {
        // Handle error response
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Parse the response if needed
      console.log('Success:', data); // Log the response from the server
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid size={6} item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Street Name'
            value={streetName}
            onChange={e => setStreetName(e.target.value)}
            required
            sx={{ mb: 2 }} // Margin bottom
          />
        </Grid>
        <Grid size={6} item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Postal Code'
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
            type='email'
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid size={6} item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Building Name (Optional) '
            value={buildingName}
            onChange={e => setBuildingName(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid size={6} item xs={12} sm={6}>
          <TextField
            fullWidth
            label='House/Unit No. (Optional)'
            value={unitNumber}
            onChange={e => setUnitNo(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>

        <Grid item size={10} xs={12} sm={6}>
          <Numberfield
            label='Number of Children'
            error={!!error} // Set error state
            value={numberChild}
            onValueChange={(_, value) => {
              if (typeof value === 'number') {
                setNumberChild(value);
              } else {
                setNumberChild(null);
              }
            }} // Handle input change
          ></Numberfield>
          {error && <Typography color='error'>{error}</Typography>} {/* Show error message */}
        </Grid>
      </Grid>

      <Grid container spacing={2} column={2}>
                {Array.from({ length: numberChild || 0 }, (_, index) => (
                    <Grid item size={12} key={index}>
                        <ChildDetail
                            index={index}
                            childDetail={childDetails[index] || { name: '', school: '' }}
                            onUpdate={updateChildDetail}
                        />
                    <Divider></Divider>
                    </Grid>
                ))}
            </Grid>
      <GenericButton buttonType='submit' buttonText='Submit' onClick={handleSubmit}> </GenericButton>
    </Box>
  );
};

export default OnboardingForm;
