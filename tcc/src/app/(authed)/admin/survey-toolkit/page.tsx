import { Box, Card, CardActions, CardContent, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function SurveyToolkitPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Survey Toolkit
      </Typography>

      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="body1" fontWeight={600}>
            Placeholder: Survey List / Survey Toolkit Home
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This page will show your survey list, filters, and survey management actions.
          </Typography>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Link href="/admin/survey-toolkit/survey-creation" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{ borderRadius: 999, textTransform: 'none', boxShadow: 'none' }}
            >
              Create New Survey
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Box>
  );
}
