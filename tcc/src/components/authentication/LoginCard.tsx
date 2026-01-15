"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import { useRouter } from "next/navigation";

type LoginValues = { email: string; password: string };
type LoginErrors = Partial<Record<keyof LoginValues, string>>;

function validate(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());

  if (!values.email.trim()) errors.email = "Email is required";
  else if (!emailOk) errors.email = "Enter a valid email";

  if (!values.password) errors.password = "Password is required";

  return errors;
}

type LoginResponse =
  | {
      accessToken: string;
      idToken: string;
      refreshToken: string;
      tokenType: string;
      expiresIn: number;
      user: { sub: string; email: string; role: "admin" | "parent"; status: "active" | "deactivated" };
    }
  | { code: string; message: string };

export default function LoginCard() {
  const router = useRouter();

  const [values, setValues] = React.useState<LoginValues>({ email: "", password: "" });
  const [errors, setErrors] = React.useState<LoginErrors>({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const onChange =
    (key: keyof LoginValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
      if (serverError) setServerError(null);
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = (await res.json()) as LoginResponse;

      if (!res.ok) {
        setServerError("message" in data ? data.message : "Login failed.");
        return;
      }

      // Redirect by role
      if ("user" in data) {
        if (data.user.role === "admin") router.push("/admin"); // adjust to your staff landing route
        else router.push("/parent"); // adjust to your parent landing route
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 520,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
        p: { xs: 3, sm: 4 },
      }}
    >
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="overline" sx={{ letterSpacing: 1.2, color: "text.secondary" }}>
          WELCOME BACK 👋
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
          Continue to your Account.
        </Typography>
      </Box>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <Button
        fullWidth
        variant="contained"
        disableElevation
        startIcon={<GoogleIcon />}
        sx={{
          bgcolor: "#E9F5FF",
          color: "text.primary",
          borderRadius: 999,
          py: 1.1,
          "&:hover": { bgcolor: "#DDF0FF" },
        }}
        onClick={() => setServerError("Google login is not implemented in the mock yet.")}
      >
        Log in with Google
      </Button>

      <Box sx={{ my: 2 }}>
        <Divider>
          <Typography variant="caption" color="text.secondary">
            OR
          </Typography>
        </Divider>
      </Box>

      <Box component="form" onSubmit={onSubmit} noValidate>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={values.email}
          onChange={onChange("email")}
          error={Boolean(errors.email)}
          helperText={errors.email}
          variant="filled"
          InputProps={{ disableUnderline: true }}
          sx={{
            "& .MuiFilledInput-root": {
              borderRadius: 2,
              bgcolor: "rgba(0,0,0,0.04)",
            },
          }}
        />

        <TextField
          fullWidth
          label="Password"
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={values.password}
          onChange={onChange("password")}
          error={Boolean(errors.password)}
          helperText={errors.password}
          variant="filled"
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiFilledInput-root": {
              borderRadius: 2,
              bgcolor: "rgba(0,0,0,0.04)",
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disableElevation
          disabled={submitting}
          sx={{
            mt: 2,
            borderRadius: 1.5,
            py: 1.2,
            bgcolor: "#1F2937",
            color: "common.white",
            "&:hover": { bgcolor: "#111827" },
          }}
        >
          {submitting ? "Continuing..." : "CONTINUE"}
        </Button>

        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Need an Account?{" "}
          <Box component="span" sx={{ color: "primary.main", cursor: "pointer" }}>
            Sign Up
          </Box>
        </Typography>
      </Box>
    </Paper>
  );
}
