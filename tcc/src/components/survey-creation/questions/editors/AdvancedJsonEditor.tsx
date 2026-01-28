"use client";

import * as React from "react";
import { Box, Button, Collapse, TextField, Typography } from "@mui/material";

type Props = {
  element: any;
  onPatch: (patch: Partial<any>) => void;
};

export function AdvancedJsonEditor({ element, onPatch }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(() => JSON.stringify(element, null, 2));
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // keep textarea in sync when element changes (like switching question)
    setValue(JSON.stringify(element, null, 2));
    setError(null);
  }, [element]);

  const apply = () => {
    try {
      const parsed = JSON.parse(value);
      // Important: you generally should NOT allow changing element.name casually,
      // because you use it as the key. We'll keep name unchanged.
      const { name, ...rest } = parsed ?? {};
      onPatch(rest);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Invalid JSON");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography sx={{ fontWeight: 700 }}>Advanced settings</Typography>
        <Button onClick={() => setOpen((v) => !v)} sx={{ textTransform: "none" }}>
          {open ? "Hide" : "Show"}
        </Button>
      </Box>

      <Collapse in={open}>
        <Box sx={{ mt: 1 }}>
          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            multiline
            minRows={10}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, fontFamily: "monospace" } }}
            helperText={error ?? "Edit SurveyJS element JSON. (name is not applied for safety)"}
            error={!!error}
          />

          <Button onClick={apply} sx={{ mt: 1, textTransform: "none" }} variant="outlined">
            Apply JSON
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
}
