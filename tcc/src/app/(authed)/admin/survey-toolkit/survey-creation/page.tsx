import { Box, Card, CardContent, Typography } from '@mui/material';

export default function SurveyCreationPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Survey Creation
      </Typography>

      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="body1" fontWeight={600}>
            Placeholder: Survey Creation Wizard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Stepper UI will live here (Details → Questions → Preview/Status).
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
