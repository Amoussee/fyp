import { Box, Paper, Typography, Stack, Chip } from '@mui/material';

export default function AdminSurveyDashboardPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="h4" fontWeight={800}>
          Survey Dashboard
        </Typography>
        <Chip label="Admin" size="small" />
      </Stack>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Placeholder page — survey analytics and management tools will be implemented here.
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: 'rgba(0,0,0,0.02)',
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
          Coming soon
        </Typography>

        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
          <li>
            <Typography>Survey list + status (draft / live / closed)</Typography>
          </li>
          <li>
            <Typography>Response count + completion rate</Typography>
          </li>
          <li>
            <Typography>Charts / trends</Typography>
          </li>
          <li>
            <Typography>Export CSV</Typography>
          </li>
        </Box>
      </Paper>
    </Box>
  );
}
