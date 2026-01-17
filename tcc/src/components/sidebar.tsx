'use client';

import type React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'general',
    label: 'General',
    icon: <SettingsIcon sx={{ fontSize: 20 }} />,
    href: '/account-management',
  },
  {
    id: 'personalisation',
    label: 'Personalisation',
    icon: <EditIcon sx={{ fontSize: 20 }} />,
    href: '/account-management/personalisation',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <NotificationsIcon sx={{ fontSize: 20 }} />,
    href: '/account-management/notifications',
  },
  {
    id: 'language',
    label: 'Language',
    icon: <LanguageIcon sx={{ fontSize: 20 }} />,
    href: '/account-management/language',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: '64px',
        height: 'calc(100vh - 64px)',
        width: '192px',
        background: 'linear-gradient(to bottom, #fef08a, #86efac, #60a5fa)',
      }}
    >
      <List sx={{ p: 2 }}>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  borderRadius: '8px',
                  py: 1.25,
                  px: 1.5,
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                  color: isActive ? '#111827' : '#374151',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
