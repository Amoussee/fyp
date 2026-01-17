import * as React from 'react';
import { Box, Container } from '@mui/material';

export default function BackgroundShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
        bgcolor: '#fff',
      }}
    >
      {/* Gradient header area */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          height: '65vh',
          background:
            'linear-gradient(90deg, rgba(120,140,255,0.85), rgba(120,255,220,0.85), rgba(255,230,140,0.85))',
        }}
      />

      {/* Angled white cut */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '58vh',
          height: '40vh',
          bgcolor: '#fff',
          transform: 'skewY(-6deg)',
          transformOrigin: 'top left',
          boxShadow: '0 -1px 0 rgba(0,0,0,0.04)',
        }}
      />

      {/* Content */}
      <Container
        maxWidth="sm"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          py: 6,
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
