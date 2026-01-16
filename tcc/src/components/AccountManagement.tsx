"use client"

import type React from "react"

import { useState } from "react"
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
} from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"

interface Account {
  id: string
  username: string
  email: string
  address: string
  tag: string
  status: "active" | "deactivated"
  groupIds: string[]
}

interface Group {
  id: string
  name: string
  memberCount: number
}

// Mock data with status and group associations
const initialAccounts: Account[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  username: "John Doe",
  email: "jd@gmail.com",
  address: "Address",
  tag: "Hwa Chong Grp 4",
  status: "active",
  groupIds: ["group-1", "group-2"],
}))

const initialGroups: Group[] = [
  { id: "group-1", name: "Hwa Chong Grp 4", memberCount: 50 },
  { id: "group-2", name: "Parent Group A", memberCount: 50 },
]

type TabType = "accounts" | "groups"

export function AccountManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("accounts")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)

  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
  const [groups, setGroups] = useState<Group[]>(initialGroups)

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [accountToDeactivate, setAccountToDeactivate] = useState<Account | null>(null)

  const itemsPerPage = 7
  const totalPages = Math.ceil(accounts.length / itemsPerPage)

  const filteredAccounts = accounts.filter(
    (account) =>
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.tag.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  const handleConfirmDeactivate = () => {
    if (accountToDeactivate) {
      // Update account status to deactivated
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) =>
          acc.id === accountToDeactivate.id ? { ...acc, status: "deactivated" as const, groupIds: [] } : acc,
        ),
      )

      // Update group member counts
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          accountToDeactivate.groupIds.includes(group.id)
            ? { ...group, memberCount: Math.max(0, group.memberCount - 1) }
            : group,
        ),
      )
    }
    setDeactivateDialogOpen(false)
    setAccountToDeactivate(null)
  }

  const handleReactivateClick = () => {
    if (selectedAccountId) {
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) =>
          acc.id === selectedAccountId ? { ...acc, status: "active" as const, groupIds: ["group-1", "group-2"] } : acc,
        ),
      )

      // Update group member counts
      setGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          memberCount: group.memberCount + 1,
        })),
      )
    }
    handleMenuClose()
  }

  // Get current selected account for conditional menu rendering
  const currentSelectedAccount = accounts.find((acc) => acc.id === selectedAccountId)

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#111827" }}>
        Account Management
      </Typography>

      {/* Tabs */}
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
          {/* Search */}
          <Box sx={{ mb: 2, width: "208px" }}>
            <TextField
              size="small"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                },
              }}
            />
          </Box>

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "none" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                  <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>Username</TableCell>
                  <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>Email</TableCell>
                  <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>Address</TableCell>
                  <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>Tag</TableCell>
                  <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>Status</TableCell>
                  <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAccounts.map((account) => (
                  <TableRow
                    key={account.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      opacity: account.status === "deactivated" ? 0.5 : 1,
                      backgroundColor: account.status === "deactivated" ? "#f9fafb" : "inherit",
                    }}
                  >
                    <TableCell sx={{ color: account.status === "deactivated" ? "#9ca3af" : "#374151" }}>
                      {account.username}
                    </TableCell>
                    <TableCell sx={{ color: account.status === "deactivated" ? "#9ca3af" : "#6b7280" }}>
                      {account.email}
                    </TableCell>
                    <TableCell sx={{ color: account.status === "deactivated" ? "#9ca3af" : "#6b7280" }}>
                      {account.address}
                    </TableCell>
                    <TableCell sx={{ color: account.status === "deactivated" ? "#9ca3af" : "#6b7280" }}>
                      {account.tag}
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
                ))}
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

          {/* Pagination */}
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
      ) : (
        /* Added Groups tab content showing group member counts */
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
            Are you sure you want to deactivate the account for <strong>{accountToDeactivate?.username}</strong> (
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
