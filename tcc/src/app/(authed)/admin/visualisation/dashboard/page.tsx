import { VisualisationDashboard } from '../../../../../components/ui/visualisationDashboard';
import { Box } from '@mui/material';

export default function VisualisationDashboardPage() {
  return (
    <Box
      sx={{
        backgroundColor: '#f9fafb',
      }}
    >
      {/* AppBar would be included in the layout or here */}
      {/* <AppBar /> - Assuming you have this component */}

      <Box sx={{ display: 'flex' }}>
        <VisualisationDashboard />
      </Box>
    </Box>
  );
}
