import { Box, Card, CardContent, Typography } from '@mui/material';

export default function VisualisationComponentsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Visualisation Components
      </Typography>

      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="body1" fontWeight={600}>
            Placeholder: Visualisation Components (Temporary)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This page can be used as a sandbox for experimenting with reusable visualisation
            components.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}