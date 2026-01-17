import { Sidebar } from '../../components/sidebar';
import { AccountManagement } from '../../components/AccountManagement';
import { Box } from '@mui/material';

export default function AccountManagementPage() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* AppBar would be included in the layout or here */}
      {/* <AppBar /> - Assuming you have this component */}

      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ ml: '192px', flexGrow: 1, pt: '64px' }}>
          <AccountManagement />
        </Box>
      </Box>
    </Box>
  );
}
