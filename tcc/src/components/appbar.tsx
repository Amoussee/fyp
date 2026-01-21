'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';

import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import { useRouter } from 'next/navigation';
import { logout } from '@/src/lib/api/auth';

const BRAND = {
  bg: '#FFFFFF',
  surface: '#F8FCF9',
  border: '#DAE0DB',
  text: '#111827',
  muted: '#6C8270',
  green: '#50ab72',
  greenSoft: 'rgba(133, 201, 158, 0.50)',
  greenHover: 'rgba(133, 201, 158, 0.30)',
};

type Setting = 'Profile' | 'Account' | 'Dashboard' | 'Logout';
const settings: Setting[] = ['Profile', 'Account', 'Dashboard', 'Logout'];

const settingIcon: Record<Setting, React.ReactNode> = {
  Profile: <PersonRoundedIcon fontSize="small" />,
  Account: <SettingsRoundedIcon fontSize="small" />,
  Dashboard: <DashboardRoundedIcon fontSize="small" />,
  Logout: <LogoutRoundedIcon fontSize="small" />,
};

export default function AppBarComponent() {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorElUser);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setAnchorElUser(null);
      router.push('/login');
      router.refresh();
    }
  };

  const handleSettingClick = (setting: Setting) => {
    // Wire these whenever you’re ready:
    // if (setting === 'Profile') router.push('/admin/profile');
    // if (setting === 'Account') router.push('/admin/account-management');
    // if (setting === 'Dashboard') router.push('/admin/dashboard');

    if (setting === 'Logout') return handleLogout();

    // TEMP: just close for now
    handleCloseUserMenu();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: BRAND.bg,
        color: BRAND.text,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ minHeight: 64, px: 2 }}>
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open profile menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User avatar" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>

            <Menu
              id="menu-profile"
              anchorEl={anchorElUser}
              open={open}
              onClose={handleCloseUserMenu}
              // ✅ anchor under the avatar, not the top of the screen
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              // ✅ Paper styling (this is the main “make it like sidebar” part)
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 1,
                  width: 260, // similar feel to sidebar items
                  p: 1, // padding around list
                  borderRadius: 3, // rounded container
                  border: `1px solid ${BRAND.border}`,
                  bgcolor: BRAND.bg,
                  overflow: 'hidden',
                  boxShadow: '0 14px 40px rgba(17, 24, 39, 0.10)',
                },
              }}
              MenuListProps={{
                sx: {
                  p: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5, // spacing between items like sidebar
                },
              }}
            >
              {/* Optional: small header like sidebar vibe */}
              <Box sx={{ px: 1, pt: 0.75, pb: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: BRAND.muted,
                    letterSpacing: '0.08em',
                  }}
                >
                  PROFILE
                </Typography>
              </Box>

              {settings.map((setting) => {
                const isLogout = setting === 'Logout';

                // Insert a divider above Logout for structure
                if (setting === 'Logout') {
                  return (
                    <React.Fragment key="divider-logout">
                      <Divider sx={{ my: 0.5, borderColor: BRAND.border }} />
                      <MenuItem
                        onClick={() => handleSettingClick('Logout')}
                        sx={{
                          borderRadius: 2.5,
                          px: 1.25,
                          py: 1.1,
                          color: BRAND.text,
                          '&:hover': {
                            bgcolor: BRAND.greenHover,
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 34, color: BRAND.green }}>
                          {settingIcon.Logout}
                        </ListItemIcon>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Logout</Typography>
                      </MenuItem>
                    </React.Fragment>
                  );
                }

                return (
                  <MenuItem
                    key={setting}
                    onClick={() => handleSettingClick(setting)}
                    sx={{
                      borderRadius: 2.5,
                      px: 1.25,
                      py: 1.1,
                      color: BRAND.text,
                      '&:hover': {
                        bgcolor: BRAND.greenHover,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 34, color: BRAND.muted }}>
                      {settingIcon[setting]}
                    </ListItemIcon>

                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{setting}</Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
