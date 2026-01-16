'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface Account {
  id: string;
  username: string;
  email: string;
  address: string;
  tag: string;
  status: 'active' | 'deactivated';
  groupIds: string[];
}

interface Group {
  id: string;
  name: string;
  memberCount: number;
}

const initialAccounts: Account[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  username: 'John Doe',
  email: 'jd@gmail.com',
  address: 'Address',
  tag: 'Hwa Chong Grp 4',
  status: 'active',
  groupIds: ['group-1', 'group-2'],
}));

const initialGroups: Group[] = [
  { id: 'group-1', name: 'Hwa Chong Grp 4', memberCount: 50 },
  { id: 'group-2', name: 'Parent Group A', memberCount: 50 },
];

type TabType = 'accounts' | 'groups';

export function AccountManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [accountToDeactivate, setAccountToDeactivate] = useState<Account | null>(null);

  const itemsPerPage = 7;
  const totalPages = Math.ceil(accounts.length / itemsPerPage);

  const filteredAccounts = accounts.filter(
    (account) =>
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, accountId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccountId(accountId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAccountId(null);
  };

  const handleDeactivateClick = () => {
    const account = accounts.find((acc) => acc.id === selectedAccountId);
    if (account) {
      setAccountToDeactivate(account);
      setDeactivateDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleConfirmDeactivate = () => {
    if (accountToDeactivate) {
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) =>
          acc.id === accountToDeactivate.id
            ? { ...acc, status: 'deactivated' as const, groupIds: [] }
            : acc,
        ),
      );

      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          accountToDeactivate.groupIds.includes(group.id)
            ? { ...group, memberCount: Math.max(0, group.memberCount - 1) }
            : group,
        ),
      );
    }
    setDeactivateDialogOpen(false);
    setAccountToDeactivate(null);
  };

  const handleReactivateClick = () => {
    if (selectedAccountId) {
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) =>
          acc.id === selectedAccountId
            ? { ...acc, status: 'active' as const, groupIds: ['group-1', 'group-2'] }
            : acc,
        ),
      );

      setGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          memberCount: group.memberCount + 1,
        })),
      );
    }
    handleMenuClose();
  };

  const currentSelectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#111827' }}>
        Account Management
      </Typography>

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
          }}
        >
          Groups
        </Button>
      </Box>

      {activeTab === 'accounts' && (
        <>
          <Box sx={{ mb: 2, width: '208px' }}>
            <TextField
              size="small"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: '100%' }}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Tag</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.address}</TableCell>
                    <TableCell>{account.tag}</TableCell>

                    <TableCell>
                      <Chip
                        label={account.status === 'active' ? 'Active' : 'Deactivated'}
                        size="small"
                        color={account.status === 'active' ? 'success' : 'error'}
                      />
                    </TableCell>

                    <TableCell>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, account.id)}>
                        <MoreHorizIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem>Edit</MenuItem>
            <MenuItem>View Details</MenuItem>

            {currentSelectedAccount?.status === 'active' ? (
              <MenuItem onClick={handleDeactivateClick} sx={{ color: 'red' }}>
                Deactivate
              </MenuItem>
            ) : (
              <MenuItem onClick={handleReactivateClick} sx={{ color: 'green' }}>
                Reactivate
              </MenuItem>
            )}
          </Menu>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
            />
          </Box>
        </>
      )}

      <Dialog open={deactivateDialogOpen} onClose={() => setDeactivateDialogOpen(false)}>
        <DialogTitle>Confirm Deactivation</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to deactivate the account for{' '}
            <strong>{accountToDeactivate?.username}</strong> ({accountToDeactivate?.email})?
          </DialogContentText>

          <Typography sx={{ mt: 2 }}>This will:</Typography>

          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Prevent the user from logging in</li>
            <li>Remove them from all associated groups</li>
            <li>Keep their record visible but marked as deactivated</li>
          </ul>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeactivateDialogOpen(false)}>Cancel</Button>

          <Button onClick={handleConfirmDeactivate} color="error" variant="contained">
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
