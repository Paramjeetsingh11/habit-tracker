// src/pages/Login.jsx
import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ VALIDATION
  const validate = () => {
    let err = {};

    if (!formData.email) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = "Enter valid email";
    }

    if (!formData.password) {
      err.password = "Password is required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await loginUser(formData);

      showSnackbar("Login Successful ✅", "success");

      localStorage.setItem("token", res.data.token);
      // store only safe fields
      localStorage.setItem("user", JSON.stringify({
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email
      }));

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      showSnackbar(err?.response?.data || "Server error ❌", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="bold"
            mb={3}
          >
            Welcome Back 👋
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />

            {/* PASSWORD */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* LOGIN BUTTON */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#4CAF50",
                borderRadius: "8px",
                py: 1.2,
                "&:hover": { backgroundColor: "#43A047" }
              }}
            >
              Login
            </Button>

            {/* REGISTER */}
            <Typography textAlign="center" mt={2}>
              Don’t have an account?{" "}
              <Link
                to="/register"
                style={{ color: "#4CAF50", fontWeight: "bold" }}
              >
                Register
              </Link>
            </Typography>

            {/* FORGOT PASSWORD */}
            <Typography textAlign="right" mt={1}>
              <Link
                to="/forgot-password"
                style={{ color: "#4CAF50", fontWeight: "bold" }}
              >
                Forgot Password?
              </Link>
            </Typography>
          </form>
        </Paper>
      </Container>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "top" }}
        sx={{ mt: 8 }} // 🔥 push it below navbar & above form
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleClose}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;