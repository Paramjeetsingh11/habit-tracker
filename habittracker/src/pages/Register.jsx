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
import { registerUser } from "../api/userApi";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOtp = () => {
    if (!formData.email) {
      alert("Enter email first ❌");
      return;
    }
    alert("OTP sent to email (UI only for now) 📩");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.otp ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields ❌");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      const res = await registerUser(formData);
      alert(res.data);

      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed ❌");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>
        <Typography variant="h5" textAlign="center" fontWeight="bold" mb={3}>
          Create Account 🚀
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* EMAIL + OTP BUTTON */}
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Button
              variant="outlined"
              onClick={handleSendOtp}
              sx={{
                borderColor: "#4CAF50",
                color: "#4CAF50",
                whiteSpace: "nowrap"
              }}
            >
              Send OTP
            </Button>
          </Box>

          {/* OTP */}
          <TextField
            fullWidth
            label="Enter OTP"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          {/* PASSWORD */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            sx={{ mt: 2 }}
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

          {/* CONFIRM PASSWORD */}
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              mt: 3,
              backgroundColor: "#4CAF50",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#43A047" }
            }}
          >
            Register
          </Button>

          {/* LOGIN LINK */}
          <Typography textAlign="center" mt={2}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#4CAF50", fontWeight: "bold" }}>
              Login
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}

export default Register;