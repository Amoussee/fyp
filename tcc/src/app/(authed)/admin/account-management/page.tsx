import { Sidebar } from '../../../../components/sidebar';
import { AccountManagement } from '../../../../components/AccountManagement';
import { Box } from '@mui/material';

export default function AccountManagementPage() {
  return (
    <Box sx={{ 
      backgroundColor: '#f9fafb' }}>
      {/* AppBar would be included in the layout or here */}
      {/* <AppBar /> - Assuming you have this component */}

      <Box sx={{ display: 'flex' }}>
        <AccountManagement />
      </Box>
    </Box>
  );
}
