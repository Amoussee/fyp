import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#50ab72' },
    text: {
      primary: '#111827',
      secondary: '#6C8270',
    },
    background: {
      default: '#F8FCF9',
      paper: '#FFFFFF',
    },
    divider: '#DAE0DB',
  },
});


export default theme;
