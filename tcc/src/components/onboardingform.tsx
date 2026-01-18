// src/components/OnboardingForm.js
'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Box, Grid, Typography } from '@mui/material';
import GenericButton from './GenericButton';
import Numberfield from './Numberfields';
import ChildDetail from './ChildDetails';
import Divider from '@mui/material/Divider';
import PhoneNumber from './PhoneNumber';


interface ChildDetail {
    name: string; // Child's name
    school: string; // Selected school
}

interface ExtractedData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}
interface OnboardingFormProps {
  initialData?: ExtractedData; // Optional prop
}

const validatePhoneNumber = (value: string) => {
  const valueWithoutSpaces = value.replace(/\s/g, '');
  return /^\+?[0-9]{6,15}$/.test(valueWithoutSpaces);
};

// Mock output simulating the external component
// TODO: When the real component is merged:
// 1. Delete this MOCK_EXTERNAL_DATA constant.
// 2. Update the OnboardingForm component to accept props (e.g., { initialData }).
// 3. Remove the hardcoded values in the useEffect below and use the props instead.
// const MOCK_EXTERNAL_DATA = {
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'john.doe@example.com',
//     password: 'password123'
// };

const OnboardingForm = ({ initialData }: OnboardingFormProps) => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [numberChild, setNumberChild] = React.useState<number | undefined>(undefined);
  const [childDetails, setChildDetails] = React.useState<ChildDetail[]>([]);
  const [phoneError, setPhoneError] = React.useState('');
  const [numberChildError, setNumberChildError] = React.useState('');
  const [submitError, setSubmitError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [schools, setSchools] = React.useState([]); // State for database schools

  // Prepopulate form with simulated data
  // useEffect(() => {
  //     setFirstName(MOCK_EXTERNAL_DATA.firstName);
  //     setLastName(MOCK_EXTERNAL_DATA.lastName);
  //     setEmail(MOCK_EXTERNAL_DATA.email);
  //     setPassword(MOCK_EXTERNAL_DATA.password);
  // }, []);

//   const addChildDetail = () => {
//     setChildDetails([...childDetails, { name: '', school: '' }]); // Add a new child detail entry
//   };

useEffect(() => {
  if (!initialData) return;

  setFirstName(initialData.firstName ?? '');
  setLastName(initialData.lastName ?? '');
  setEmail(initialData.email ?? '');

  if (initialData.password) {
    setPassword(initialData.password);
  }
}, [initialData]);

  useEffect(() => { // to get the list of schools from db
      const fetchSchools = async () => {
        try {
          const response = await fetch('http://localhost:5001/api/schools');
          const data = await response.json();
          setSchools(data); // Stores the cleaned school list from DB
        } catch (err) {
          console.error("Failed to load schools:", err);
        }
      };
      fetchSchools();
    }, []);

  const updateChildDetail = (index: number, detail: { name: string; school: string }) => {
    const updatedDetails = [...childDetails];
    updatedDetails[index] = detail; // Update specific child's detail
    setChildDetails(updatedDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    if (!numberChild) {
      setNumberChildError('Please enter a number.');
      setIsSubmitting(false);
      return;
    }

    console.log(numberChildError);

    const formData = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      numberChild: numberChild?.toString() || '',
      childDetails
    };

    console.log(formData);

  try {
    const response = await fetch('http://localhost:5001/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      // User-facing error from backend
      setSubmitError(data.error || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
      return;
    }

    console.log('Success:', data);
  } catch (err) {
    // Network / server down
    setSubmitError('Unable to connect. Please try again later.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid size={6} item xs={12} sm={6}>
          <TextField
            fullWidth
            label='First Name'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            sx={{ mb: 2 }} // Margin bottom
          />
        </Grid>
        <Grid size={6} item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Last Name'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            type='email'
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid size={6} item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Email'
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid size={6} item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Password'
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid size={6} item xs={12} sm={6}>
          <PhoneNumber
            value={phoneNumber}
            onChange={(newValue) => {
              setPhoneNumber(newValue);

              if (!newValue) {
                setPhoneError('Phone number is required');
              } else if (!validatePhoneNumber(newValue)) {
                setPhoneError('Enter a valid phone number');
              } else {
                setPhoneError('');
              }
            }}
            error={!!phoneError}
            helperText={phoneError}
            label='Phone Number'
            required
            sx={{ mb: 2 }}
          />
        </Grid>

        <Grid item size={10} xs={12} sm={6}>
          <Numberfield
            label='Number of Children'
            error={!!numberChildError} // Set error state
            value={numberChild}
            onValueChange={(_, value) => {
              if (typeof value === 'number') {
                setNumberChild(value);
              } else {
                setNumberChild(undefined);
              }
            }} // Handle input change
          ></Numberfield>
          {numberChildError && <Typography color='error'>{numberChildError}</Typography>} {/* Show error message */}
        </Grid>
      </Grid>

      <Grid container spacing={2} column={2}>
        {Array.from({ length: numberChild || 0 }, (_, index) => (
          <Grid item size={12} key={index}>
              <ChildDetail
                  index={index}
                  childDetail={childDetails[index] || { name: '', school: '' }}
                  onUpdate={updateChildDetail}
                  schools={schools} // Pass the database list down as a prop
              />
            <Divider></Divider>
          </Grid>
        ))}
        </Grid>
        {submitError && (
            <Typography color="error" sx={{ mt: 2 }}>
                {submitError}
            </Typography>
        )}
      <GenericButton buttonType='submit' buttonText={isSubmitting ? 'Submitting...' : 'Submit'} disabled={isSubmitting} onClick={handleSubmit}> </GenericButton>
    </Box>
  );
};

export default OnboardingForm;
