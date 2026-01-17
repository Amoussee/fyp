"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
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
} from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"

interface Account {
  id: string
  firstname: string
  email: string
  tag: string
  status: "active" | "deactivated"
  groupIds: string[]
}

interface Group {
  id: string
  name: string
  memberCount: number
}

interface UserApiResponse {
  user_id: number
  firstname: string
  email: string
  tag: string
  deactivated: boolean
  groupIds?: string[]
}

type TabType = "accounts" | "groups"

export function AccountManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("accounts")
  const [currentPage, setCurrentPage] = useState(1)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)

  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [groups, setGroups] = useState<Group[]>([
    { id: "group-1", name: "Hwa Chong Grp 4", memberCount: 50 },
    { id: "group-2", name: "Parent Group A", memberCount: 50 },
  ])

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [accountToDeactivate, setAccountToDeactivate] = useState<Account | null>(null)

  const [searchQuery, setSearchQuery] = useState("")

  // Fetch accounts using GET /api/users
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/api/users`)
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`)
      }

      const users: UserApiResponse[] = await response.json()
      
      setAccounts(
        users.map((user) => ({
          id: String(user.user_id),
          firstname: user.firstname,
          email: user.email,
          tag: user.tag,
          status: user.deactivated ? "deactivated" : "active",
          groupIds: user.groupIds || [],
        })),
      )
    } catch (err) {
      console.error("Error fetching accounts:", err)
      setError(err instanceof Error ? err.message : "Failed to load accounts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const itemsPerPage = 7

  const filteredAccounts = accounts.filter((account) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      account.firstname.toLowerCase().includes(query) ||
      account.email.toLowerCase().includes(query) ||
      account.tag.toLowerCase().includes(query)
    )
  })

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)
  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, accountId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedAccountId(accountId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedAccountId(null)
  }

  const handleDeactivateClick = () => {
    const account = accounts.find((acc) => acc.id === selectedAccountId)
    if (account) {
      setAccountToDeactivate(account)
      setDeactivateDialogOpen(true)
    }
    handleMenuClose()
  }

  // Deactivate account using PATCH /api/users/:id/deactivate
  const handleConfirmDeactivate = async () => {
    if (!accountToDeactivate) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${accountToDeactivate.id}/deactivate`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error(`Failed to deactivate user: ${response.status}`)
      }

      // Refresh accounts to get updated data from server
      await fetchAccounts()

      // Update groups count (if you track this locally)
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          accountToDeactivate.groupIds.includes(group.id)
            ? { ...group, memberCount: Math.max(0, group.memberCount - 1) }
            : group,
        ),
      )
    } catch (err) {
      console.error("Failed to deactivate account:", err)
      setError(err instanceof Error ? err.message : "Failed to deactivate account")
    } finally {
      setDeactivateDialogOpen(false)
      setAccountToDeactivate(null)
    }
  }

  // Reactivate account using PUT /api/users/:id
  const handleReactivateClick = async () => {
    if (!selectedAccountId) return

    const account = accounts.find((acc) => acc.id === selectedAccountId)
    if (!account) return

    try {
      // Use PUT to update the user's deactivated status back to false
      const response = await fetch(`${API_BASE_URL}/api/users/${selectedAccountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: account.firstname,
          email: account.email,
          tag: account.tag,
          deactivated: false,
          groupIds: ["group-1", "group-2"], // Restore to default groups or customize
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to reactivate user: ${response.status}`)
      }

      // Refresh accounts to get updated data
      await fetchAccounts()

      // Update groups count
      setGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          memberCount: group.memberCount + 1,
        })),
      )
    } catch (err) {
      console.error("Failed to reactivate account:", err)
      setError(err instanceof Error ? err.message : "Failed to reactivate account")
    } finally {
      handleMenuClose()
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setCurrentPage(1)
  }

  const currentSelectedAccount = accounts.find((acc) => acc.id === selectedAccountId)

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#111827" }}>
        Account Management
      </Typography>

      <Box sx={{ mb: 3, display: "flex", gap: 1 }}>
        <Button
          onClick={() => setActiveTab("accounts")}
          sx={{
            borderRadius: "8px",
            px: 10,
            py: 1.5,
            textTransform: "none",
            fontSize: "0.9rem",
            backgroundColor: activeTab === "accounts" ? "#15803d" : "#e5e7eb",
            color: activeTab === "accounts" ? "white" : "#374151",
            "&:hover": {
              backgroundColor: activeTab === "accounts" ? "#166534" : "#d1d5db",
            },
          }}
        >
          Accounts
        </Button>
        <Button
          onClick={() => setActiveTab("groups")}
          sx={{
            borderRadius: "8px",
            px: 10,
            py: 1.5,
            textTransform: "none",
            fontSize: "0.9rem",
            backgroundColor: activeTab === "groups" ? "#15803d" : "#e5e7eb",
            color: activeTab === "groups" ? "white" : "#374151",
            "&:hover": {
              backgroundColor: activeTab === "groups" ? "#166534" : "#d1d5db",
            },
          }}
        >
          Groups
        </Button>
      </Box>

      {activeTab === "accounts" ? (
        <>
          <Box sx={{ mb: 2 }}>
            <TextField
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              sx={{
                width: "250px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "white",
                },
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#15803d" }} />
            </Box>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "none" }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                      <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>First Name</TableCell>
                      <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>Email</TableCell>
                      <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>Tag</TableCell>
                      <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>Status</TableCell>
                      <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: "#6b7280" }}>
                          No accounts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAccounts.map((account) => (
                        <TableRow
                          key={account.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            opacity: account.status === "deactivated" ? 0.5 : 1,
                            backgroundColor: account.status === "deactivated" ? "#f9fafb" : "inherit",
                          }}
                        >
                          <TableCell sx={{ color: account.status === "deactivated" ? "#9ca3af" : "#374151" }}>
                            {account.firstname}
                          </TableCell>
                          <TableCell sx={{ color: account.status === "deactivated" ? "#9ca3af" : "#6b7280" }}>
                            {account.email}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={account.tag}
                              size="small"
                              sx={{
                                backgroundColor: "#e5e7eb",
                                color: account.status === "deactivated" ? "#9ca3af" : "#374151",
                                fontWeight: 500,
                                fontSize: "0.75rem",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {account.status === "deactivated" ? (
                              <Chip
                                label="Deactivated"
                                size="small"
                                sx={{
                                  backgroundColor: "#fee2e2",
                                  color: "#dc2626",
                                  fontWeight: 500,
                                  fontSize: "0.75rem",
                                }}
                              />
                            ) : (
                              <Chip
                                label="Active"
                                size="small"
                                sx={{
                                  backgroundColor: "#dcfce7",
                                  color: "#15803d",
                                  fontWeight: 500,
                                  fontSize: "0.75rem",
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
                <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
                {currentSelectedAccount?.status === "active" ? (
                  <MenuItem onClick={handleDeactivateClick} sx={{ color: "#dc2626" }}>
                    Deactivate
                  </MenuItem>
                ) : (
                  <MenuItem onClick={handleReactivateClick} sx={{ color: "#15803d" }}>
                    Reactivate
                  </MenuItem>
                )}
              </Menu>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
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
        <TableContainer component={Paper} sx={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>Group Name</TableCell>
                <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>Member Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell sx={{ color: "#374151" }}>{group.name}</TableCell>
                  <TableCell sx={{ color: "#6b7280" }}>{group.memberCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deactivateDialogOpen} onClose={() => setDeactivateDialogOpen(false)}>
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deactivate the account for <strong>{accountToDeactivate?.firstname}</strong> (
            {accountToDeactivate?.email})?
            <br />
            <br />
            This will:
            <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
              <li>Prevent the user from logging in</li>
              <li>Remove them from all associated groups</li>
              <li>Keep their record visible but marked as deactivated</li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeactivateDialogOpen(false)} sx={{ color: "#6b7280" }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeactivate}
            sx={{
              backgroundColor: "#dc2626",
              color: "white",
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}