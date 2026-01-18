'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
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
  CircularProgress,
  TextField,
  Alert,
  TableSortLabel,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { UniversalFilter, type FilterConfig, type FilterValues } from './UniversalFilter';
import type { Dayjs } from 'dayjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface Account {
  id: string;
  firstname: string;
  email: string;
  tag: string;
  status: 'active' | 'deactivated';
  groupIds: string[];
}

interface Group {
  id: string;
  name: string;
  memberCount: number;
}

interface UserApiResponse {
  user_id: number;
  firstname: string;
  email: string;
  tag: string;
  deactivated: boolean;
  groupIds?: string[];
}

type TabType = 'accounts' | 'groups';
type SortField = 'firstname' | 'email' | 'tag' | 'status';
type SortOrder = 'asc' | 'desc';

export function AccountManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('accounts');
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [groups, setGroups] = useState<Group[]>([
    { id: 'group-1', name: 'Hwa Chong Grp 4', memberCount: 50 },
    { id: 'group-2', name: 'Parent Group A', memberCount: 50 },
  ]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);
  const [editFormData, setEditFormData] = useState({ firstname: '', email: '', tag: '' });

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [accountToDeactivate, setAccountToDeactivate] = useState<Account | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Filter state
  const [filterValues, setFilterValues] = useState<FilterValues>({
    firstnameAlphabet: [],
    emailAlphabet: [],
    status: '',
    tag: [],
  });

  // Sorting state
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Filter configuration for Account Management
  const filterConfig: FilterConfig[] = useMemo(
    () => [
      {
        field: 'firstnameAlphabet',
        label: 'First Name (Starts With)',
        type: 'alphabet',
      },
      {
        field: 'emailAlphabet',
        label: 'Email (Starts With)',
        type: 'alphabet',
      },
      {
        field: 'status',
        label: 'Account Status',
        type: 'radio',
        options: [
          { value: '', label: 'All' },
          { value: 'active', label: 'Active Only' },
          { value: 'deactivated', label: 'Deactivated Only' },
        ],
      },
      {
        field: 'tag',
        label: 'Tag',
        type: 'checkbox',
        options: [
          { value: 'Student', label: 'Student' },
          { value: 'Teacher', label: 'Teacher' },
          { value: 'Parent', label: 'Parent' },
          { value: 'Admin', label: 'Admin' },
        ],
      },
    ],
    [],
  );

  // Fetch accounts using GET /api/users
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/users`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const users: UserApiResponse[] = await response.json();

      setAccounts(
        users.map((user) => ({
          id: String(user.user_id),
          firstname: user.firstname,
          email: user.email,
          tag: user.tag,
          status: user.deactivated ? 'deactivated' : 'active',
          groupIds: user.groupIds || [],
        })),
      );
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const itemsPerPage = 7;

  // Apply filters and search
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          account.firstname.toLowerCase().includes(query) ||
          account.email.toLowerCase().includes(query) ||
          account.tag.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // First name alphabet filter
      const firstnameAlphabet = filterValues.firstnameAlphabet as string[];
      if (firstnameAlphabet.length > 0) {
        const firstLetter = account.firstname.charAt(0).toUpperCase();
        if (!firstnameAlphabet.includes(firstLetter)) return false;
      }

      // Email alphabet filter
      const emailAlphabet = filterValues.emailAlphabet as string[];
      if (emailAlphabet.length > 0) {
        const firstLetter = account.email.charAt(0).toUpperCase();
        if (!emailAlphabet.includes(firstLetter)) return false;
      }

      // Status filter
      if (filterValues.status && filterValues.status !== account.status) {
        return false;
      }

      // Tag filter
      const tagFilter = filterValues.tag as string[];
      if (tagFilter.length > 0 && !tagFilter.includes(account.tag)) {
        return false;
      }

      return true;
    });
  }, [accounts, searchQuery, filterValues]);

  // Apply sorting
  const sortedAccounts = useMemo(() => {
    if (!sortField) return filteredAccounts;

    return [...filteredAccounts].sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredAccounts, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedAccounts.length / itemsPerPage);
  const paginatedAccounts = sortedAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
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

  const handleEdit = () => {
    if (!selectedAccountId) return;
    // do something with selectedAccountId
    handleMenuClose();
  };

  const handleDelete = () => {
    if (!selectedAccountId) return;
    // do something with selectedAccountId
    handleMenuClose();
  };

  const handleViewDetails = () => {
    if (!selectedAccountId) return;
    // do something with selectedAccountId
    handleMenuClose();
  };

  const handleEditClick = () => {
    const account = accounts.find((acc) => acc.id === selectedAccountId);
    if (account) {
      setAccountToEdit(account);
      setEditFormData({
        firstname: account.firstname,
        email: account.email,
        tag: account.tag,
      });
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeactivateClick = () => {
    const account = accounts.find((acc) => acc.id === selectedAccountId);
    if (account) {
      setAccountToDeactivate(account);
      setDeactivateDialogOpen(true);
    }
    handleMenuClose();
  };

  // Update account using PUT /api/users/:id
  const handleConfirmEdit = async () => {
    if (!accountToEdit) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${accountToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: editFormData.firstname,
          email: editFormData.email,
          tag: editFormData.tag,
          deactivated: accountToEdit.status === 'deactivated',
          groupIds: accountToEdit.groupIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }

      await fetchAccounts();
    } catch (err) {
      console.error('Failed to update account:', err);
      setError(err instanceof Error ? err.message : 'Failed to update account');
    } finally {
      setEditDialogOpen(false);
      setAccountToEdit(null);
    }
  };

  // Deactivate account using PATCH /api/users/:id/deactivate
  const handleConfirmDeactivate = async () => {
    if (!accountToDeactivate) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${accountToDeactivate.id}/deactivate`,
        {
          method: 'PATCH',
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to deactivate user: ${response.status}`);
      }

      await fetchAccounts();

      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          accountToDeactivate.groupIds.includes(group.id)
            ? { ...group, memberCount: Math.max(0, group.memberCount - 1) }
            : group,
        ),
      );
    } catch (err) {
      console.error('Failed to deactivate account:', err);
      setError(err instanceof Error ? err.message : 'Failed to deactivate account');
    } finally {
      setDeactivateDialogOpen(false);
      setAccountToDeactivate(null);
    }
  };

  // Reactivate account using PUT /api/users/:id
  const handleReactivateClick = async () => {
    if (!selectedAccountId) return;

    const account = accounts.find((acc) => acc.id === selectedAccountId);
    if (!account) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${selectedAccountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: account.firstname,
          email: account.email,
          tag: account.tag,
          deactivated: false,
          groupIds: ['group-1', 'group-2'],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to reactivate user: ${response.status}`);
      }

      await fetchAccounts();

      setGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          memberCount: group.memberCount + 1,
        })),
      );
    } catch (err) {
      console.error('Failed to reactivate account:', err);
      setError(err instanceof Error ? err.message : 'Failed to reactivate account');
    } finally {
      handleMenuClose();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilterValues: FilterValues) => {
    setFilterValues(newFilterValues);
    setCurrentPage(1); // Reset to first page when filters change
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

      {activeTab === 'accounts' ? (
        <>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <UniversalFilter
              filters={filterConfig}
              values={filterValues}
              onChange={handleFilterChange}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#15803d' }} />
            </Box>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                      <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>
                        <TableSortLabel
                          active={sortField === 'firstname'}
                          direction={sortField === 'firstname' ? sortOrder : 'asc'}
                          onClick={() => handleSort('firstname')}
                        >
                          First Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>
                        <TableSortLabel
                          active={sortField === 'email'}
                          direction={sortField === 'email' ? sortOrder : 'asc'}
                          onClick={() => handleSort('email')}
                        >
                          Email
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>
                        <TableSortLabel
                          active={sortField === 'tag'}
                          direction={sortField === 'tag' ? sortOrder : 'asc'}
                          onClick={() => handleSort('tag')}
                        >
                          Tag
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>
                        <TableSortLabel
                          active={sortField === 'status'}
                          direction={sortField === 'status' ? sortOrder : 'asc'}
                          onClick={() => handleSort('status')}
                        >
                          Status
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#6b7280' }}>
                          No accounts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAccounts.map((account) => (
                        <TableRow
                          key={account.id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            opacity: account.status === 'deactivated' ? 0.5 : 1,
                            backgroundColor:
                              account.status === 'deactivated' ? '#f9fafb' : 'inherit',
                          }}
                        >
                          <TableCell
                            sx={{ color: account.status === 'deactivated' ? '#9ca3af' : '#374151' }}
                          >
                            {account.firstname}
                          </TableCell>
                          <TableCell
                            sx={{ color: account.status === 'deactivated' ? '#9ca3af' : '#6b7280' }}
                          >
                            {account.email}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={account.tag}
                              size="small"
                              sx={{
                                backgroundColor: '#e5e7eb',
                                color: account.status === 'deactivated' ? '#9ca3af' : '#374151',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {account.status === 'deactivated' ? (
                              <Chip
                                label="Deactivated"
                                size="small"
                                sx={{
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                }}
                              />
                            ) : (
                              <Chip
                                label="Active"
                                size="small"
                                sx={{
                                  backgroundColor: '#dcfce7',
                                  color: '#15803d',
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, account.id)}>
                              <MoreHorizIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
                {currentSelectedAccount?.status === 'active' ? (
                  <MenuItem onClick={handleDeactivateClick} sx={{ color: '#dc2626' }}>
                    Deactivate
                  </MenuItem>
                ) : (
                  <MenuItem onClick={handleReactivateClick} sx={{ color: '#15803d' }}>
                    Reactivate
                  </MenuItem>
                )}
              </Menu>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  shape="rounded"
                  color="primary"
                />
              </Box>
            </>
          )}
        </>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none' }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>Group Name</TableCell>
                <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>Member Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell sx={{ color: '#374151' }}>{group.name}</TableCell>
                  <TableCell sx={{ color: '#6b7280' }}>{group.memberCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Account</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="First Name"
              value={editFormData.firstname}
              onChange={(e) => setEditFormData({ ...editFormData, firstname: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Tag"
              value={editFormData.tag}
              onChange={(e) => setEditFormData({ ...editFormData, tag: e.target.value })}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: '#6b7280' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmEdit}
            disabled={!editFormData.firstname || !editFormData.email || !editFormData.tag}
            sx={{
              backgroundColor: '#15803d',
              color: 'white',
              '&:hover': { backgroundColor: '#166534' },
              '&:disabled': { backgroundColor: '#d1d5db', color: '#9ca3af' },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deactivate Dialog */}
      <Dialog open={deactivateDialogOpen} onClose={() => setDeactivateDialogOpen(false)}>
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deactivate the account for{' '}
            <strong>{accountToDeactivate?.firstname}</strong> ({accountToDeactivate?.email})?
            <br />
            <br />
            This will:
            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
              <li>Prevent the user from logging in</li>
              <li>Remove them from all associated groups</li>
              <li>Keep their record visible but marked as deactivated</li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeactivateDialogOpen(false)} sx={{ color: '#6b7280' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeactivate}
            sx={{
              backgroundColor: '#dc2626',
              color: 'white',
              '&:hover': { backgroundColor: '#b91c1c' },
            }}
          >
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
