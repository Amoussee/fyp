'use client';

import * as React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import { logout } from '@/src/lib/api/auth';

type NavItem = { label: string; href: string; icon: React.ReactNode };
type NavSection = { heading: string; items: NavItem[] };

const navSections: NavSection[] = [
  {
    heading: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: <DashboardRoundedIcon /> }],
  },
  {
    heading: 'Toolkit',
    items: [
      { label: 'Survey List', href: '/admin/survey-toolkit', icon: <AssignmentRoundedIcon /> },
      { label: 'Visualisation', href: '/admin/visualisation', icon: <InsightsRoundedIcon /> },
    ],
  },
  {
    heading: 'Admin',
    items: [
      {
        label: 'Account Management',
        href: '/admin/account-management',
        icon: <ManageAccountsRoundedIcon />,
      },
    ],
  },
];

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

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/');
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    setCollapsed(isMdDown);
  }, [isMdDown]);

  const widthExpanded = 280;
  const widthCollapsed = 84;

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <Box
      component="aside"
      sx={{
        width: collapsed ? widthCollapsed : widthExpanded,
        flexShrink: 0,
        height: '100dvh',
        position: 'sticky',
        top: 0,
        borderRight: `1px solid ${BRAND.border}`,
        bgcolor: BRAND.surface,
        transition: 'width 220ms ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 65,
          px: collapsed ? 1 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          bgcolor: BRAND.bg,
          borderBottom: `1px solid ${BRAND.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, overflow: 'hidden' }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2, overflow: 'hidden' }}>
            <Image
              src="/logo.png"
              alt="The Circular Classroom"
              width={44}
              height={44}
              style={{ width: '44px', height: '44px', objectFit: 'contain' }}
            />
          </Box>

          {!collapsed && (
            <Typography sx={{ fontWeight: 600, color: BRAND.text, fontSize: 14 }} noWrap>
              The Circular Classroom
            </Typography>
          )}
        </Box>

        {!collapsed ? (
          <Tooltip title="Collapse">
            <IconButton
              onClick={() => setCollapsed(true)}
              size="small"
              sx={{ border: `1px solid ${BRAND.border}`, bgcolor: BRAND.bg }}
            >
              <ChevronLeftRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Expand">
            <IconButton
              onClick={() => setCollapsed(false)}
              size="small"
              sx={{ border: `1px solid ${BRAND.border}`, bgcolor: BRAND.bg }}
            >
              <ChevronRightRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Sections */}
      <Box sx={{ px: collapsed ? 1 : 1.5, py: 1.5, flex: 1, overflowY: 'auto' }}>
        {navSections.map((section) => (
          <Box key={section.heading} sx={{ mb: 2 }}>
            {!collapsed && (
              <Typography
                sx={{
                  px: 1,
                  mb: 0.75,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: BRAND.muted,
                  textTransform: 'uppercase',
                }}
              >
                {section.heading}
              </Typography>
            )}

            <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0 }}>
              {section.items.map((item) => {
                const active = isRouteActive(pathname, item.href);

                return (
                  <Tooltip key={item.label} title={collapsed ? item.label : ''} placement="right">
                    <ListItemButton
                      onClick={() => router.push(item.href)}
                      sx={{
                        borderRadius: 2.5,
                        px: collapsed ? 1.25 : 1.5,
                        py: 1.2,
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        color: active ? BRAND.text : BRAND.muted,
                        bgcolor: active ? BRAND.greenSoft : 'transparent',
                        border: active ? `1px solid rgba(34,197,94,0.30)` : `1px solid transparent`,
                        '&:hover': {
                          bgcolor: active ? BRAND.greenSoft : BRAND.greenHover,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: collapsed ? 0 : 1.5,
                          color: active ? BRAND.green : BRAND.muted,
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      {!collapsed && (
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: active ? 600 : 400,
                            noWrap: true,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: collapsed ? 1 : 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            gap: collapsed ? 0 : 1.25,
            bgcolor: BRAND.bg,
            border: `1px solid ${BRAND.border}`,
            borderRadius: 3,
            p: 1.25,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, overflow: 'hidden' }}>
            {!collapsed && <Avatar sx={{ width: 36, height: 36 }}>U</Avatar>}
            {!collapsed && (
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: BRAND.text }} noWrap>
                  User
                </Typography>
                <Typography sx={{ fontSize: 12, color: BRAND.muted }} noWrap>
                  Role
                </Typography>
              </Box>
            )}
          </Box>

          <Tooltip title="Logout">
            <IconButton
              onClick={handleLogout}
              size="small"
              sx={{ border: `1px solid ${BRAND.border}`, bgcolor: BRAND.bg }}
            >
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider />
    </Box>
  );
}
