"use client";

import * as React from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { BRAND } from "@/src/styles/brand";

type Props = {
  open: boolean;
  onClose: () => void;

  title: React.ReactNode;
  subtitle?: React.ReactNode;

  icon?: React.ReactNode;              // optional left icon
  children: React.ReactNode;           // content area
  actions?: React.ReactNode;           // action buttons area

  showCloseIcon?: boolean;             // optional top-right X
  maxWidthPx?: number;                 // optional sizing
};

export function StyledDialog({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  actions,
  showCloseIcon = false,
  maxWidthPx = 560,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${BRAND.border}`,
          boxShadow: "0 18px 60px rgba(0,0,0,0.20)",
          minWidth: { xs: "92vw", sm: maxWidthPx },
        },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            {icon ? <Box sx={{ display: "grid", placeItems: "center" }}>{icon}</Box> : null}

            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>
                {title}
              </Typography>

              {subtitle ? (
                <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                  {subtitle}
                </Typography>
              ) : null}
            </Box>
          </Box>

          {showCloseIcon ? (
            <IconButton
              onClick={onClose}
              size="small"
              aria-label="Close"
              sx={{
                borderRadius: "50%",
                color: "text.secondary",
                "&:hover": { bgcolor: "rgba(0,0,0,0.06)" },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          ) : null}
        </Box>
      </DialogTitle>

      <Divider sx={{ borderColor: BRAND.border, mx: 2 }} />

      <DialogContent sx={{ px: 3, py: 2 }}>{children}</DialogContent>

      {actions ? (
        <>
          <Divider sx={{ borderColor: BRAND.border, mx: 2 }} />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>{actions}</DialogActions>
        </>
      ) : null}
    </Dialog>
  );
}
