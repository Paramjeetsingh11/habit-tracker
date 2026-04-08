import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all fields ❌");
      return;
    }

    try {
      const res = await loginUser(formData);

      alert("Login Successful ✅");

      localStorage.setItem("user", JSON.stringify(res.data));

      navigate("/dashboard");

    } catch (err) {
      console.error(err);

      if (err.response) {
        alert(err.response.data);
      } else {
        alert("Server error ❌");
      }
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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: "12px"
          }}
        >
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
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* BUTTON */}
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

            {/* REGISTER LINK */}
            <Typography textAlign="center" mt={2}>
              Don’t have an account?{" "}
              <Link
                to="/register"
                style={{ color: "#4CAF50", fontWeight: "bold" }}
              >
                Register
              </Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;