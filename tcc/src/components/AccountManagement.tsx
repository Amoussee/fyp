'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Typography,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface Account {
  id: string;
  username: string;
  email: string;
  address: string;
  tag: string;
}

// Mock data
const mockAccounts: Account[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  username: 'John Doe',
  email: 'jd@gmail.com',
  address: 'Address',
  tag: 'Hwa Chong Grp 4',
}));

type TabType = 'accounts' | 'groups';

export function AccountManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const itemsPerPage = 7;
  const totalPages = Math.ceil(mockAccounts.length / itemsPerPage);

  const filteredAccounts = mockAccounts.filter(
    (account) =>
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleAccountSelection = (id: string) => {
    const newSelected = new Set(selectedAccounts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAccounts(newSelected);
  };

  const toggleAllAccounts = () => {
    if (selectedAccounts.size === paginatedAccounts.length) {
      setSelectedAccounts(new Set());
    } else {
      setSelectedAccounts(new Set(paginatedAccounts.map((acc) => acc.id)));
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, accountId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccountId(accountId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAccountId(null);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#111827' }}>
        Account Management
      </Typography>

      {/* Tabs */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <Button
          onClick={() => setActiveTab('accounts')}
          sx={{
            borderRadius: '8px',
            px: 10,
            py: 1.5,
            textTransform: 'none',
            fontSize: '0.9rem',
            backgroundColor: activeTab === 'accounts' ? '#15803d' : '#e5e7eb',
            color: activeTab === 'accounts' ? 'white' : '#374151',
            '&:hover': {
              backgroundColor: activeTab === 'accounts' ? '#166534' : '#d1d5db',
            },
          }}
        >
          Accounts
        </Button>
        <Button
          onClick={() => setActiveTab('groups')}
          sx={{
            borderRadius: '8px',
            px: 10,
            py: 1.5,
            textTransform: 'none',
            fontSize: '0.9rem',
            backgroundColor: activeTab === 'groups' ? '#15803d' : '#e5e7eb',
            color: activeTab === 'groups' ? 'white' : '#374151',
            '&:hover': {
              backgroundColor: activeTab === 'groups' ? '#166534' : '#d1d5db',
            },
          }}
        >
          Groups
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2, width: '208px' }}>
        <TextField
          size="small"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              borderRadius: '6px',
            },
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    selectedAccounts.size === paginatedAccounts.length &&
                    paginatedAccounts.length > 0
                  }
                  onChange={toggleAllAccounts}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>Username</TableCell>
              <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>Email</TableCell>
              <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>Address</TableCell>
              <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>Tag</TableCell>
              <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAccounts.map((account) => (
              <TableRow key={account.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAccounts.has(account.id)}
                    onChange={() => toggleAccountSelection(account.id)}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ color: '#374151' }}>{account.username}</TableCell>
                <TableCell sx={{ color: '#6b7280' }}>{account.email}</TableCell>
                <TableCell sx={{ color: '#6b7280' }}>{account.address}</TableCell>
                <TableCell sx={{ color: '#6b7280' }}>{account.tag}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, account.id)}>
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
      </Menu>

      {/* Pagination */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          shape="rounded"
          color="primary"
        />
      </Box>
    </Box>
  );
}
