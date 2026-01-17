'use client';
// /app/onboardingform/page.tsx
// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { FilledInput } from '@mui/material';
import OnboardingForm from '@/src/components/onboardingform';
import '@/src/styles/globals.css';
import { Container, Box, Typography } from '@mui/material';

const OnboardingFormPage = () => {
  return (
    <Container>
      <Box sx={{ padding: '16px 0' }}>
        <Typography variant="h4" gutterBottom>
          Let&apos;s get Started
        </Typography>
        <Typography gutterBottom sx={{ color: 'var(--dark-2)' }}>
          Please provide the details of your child&apos;s school and its location. This information will
          help us accurately assess your emissions.
        </Typography>
      </Box>

      <Box>
        <OnboardingForm></OnboardingForm>
      </Box>
    </Container>
  );
};

export default OnboardingFormPage;
