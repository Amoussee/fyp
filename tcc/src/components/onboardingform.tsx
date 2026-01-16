// src/components/OnboardingForm.js
"use client";
import React from 'react';
import { TextField, Button, Box, Grid } from '@mui/material';
import GenericButton from './GenericButton';

const OnboardingForm = () => {
    const [streetName, setStreetName] = React.useState('');
    const [postalCode, setPostalCode] = React.useState('');
    const [buildingName, setBuildingName] = React.useState('');
    const [unitNumber, setUnitNo] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = {
            streetName,
            postalCode,
            buildingName,
            unitNumber,
        };
    
        try {
            const response = await fetch('/api/submit', { // Change URL to your actual endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                // Handle error response
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json(); // Parse the response if needed
            console.log("Success:", data); // Log the response from the server
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                <Grid size={6}  item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Street Name"
                        value={streetName}
                        onChange={(e) => setStreetName(e.target.value)}
                        required
                        sx={{ mb: 2 }} // Margin bottom
                    />
                </Grid>
                <Grid size={6} item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Postal Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        type="email"
                        required
                        sx={{ mb: 2  }}
                    />
                </Grid>
                <Grid size={6}  item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Building Name (Optional) "
                        value={buildingName}
                        onChange={(e) => setBuildingName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </Grid>
                <Grid size={6} item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="House/Unit No. (Optional)"
                        value={unitNumber}
                        onChange={(e) => setUnitNo(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </Grid>
            <GenericButton buttonType="submit" buttonText="Submit" onClick={handleSubmit}></GenericButton>
            </Grid>
        </Box>
    );
};

export default OnboardingForm;
