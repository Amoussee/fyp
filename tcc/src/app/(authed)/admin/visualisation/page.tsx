import { Box, Card, CardContent, Typography } from '@mui/material';

export default function VisualisationsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Visualisations
      </Typography>

      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="body1" fontWeight={600}>
            Placeholder: Visualisations
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This page will show charts, dashboards, and analysis views.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
