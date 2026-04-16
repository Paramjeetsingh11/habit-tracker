// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import {
  Container, Paper, TextField, Typography, Button, Box,
  InputAdornment, IconButton, Snackbar, Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, sendOtp, verifyOtp } from "../api/userApi";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", otp: "", password: "", confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false, message: "", severity: "success"
  });

  const showSnackbar = (msg, type="success") =>
    setSnackbar({ open: true, message: msg, severity: type });

  const handleClose = () =>
    setSnackbar({ ...snackbar, open: false });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // 🔥 TIMER
  useEffect(() => {
    let interval;
    if (timer > 0 && !otpVerified) {
      interval = setInterval(() => setTimer(p => p - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, otpVerified]);

  // ✅ VALIDATION
  const validate = () => {
    let err = {};

    if (!formData.name) err.name = "Name required";

    if (!formData.email) err.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      err.email = "Invalid email";

    if (!formData.otp) err.otp = "OTP required";
    else if (!otpVerified) err.otp = "Please verify OTP";

    // 🔥 PASSWORD VALIDATION (FIXED)
    if (!formData.password) {
      err.password = "Password required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(formData.password)
    ) {
      err.password =
        "Must include uppercase, lowercase, number & special character";
    }

    if (!formData.confirmPassword) {
      err.confirmPassword = "Confirm password required";
    } else if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ SEND OTP
  const handleSendOtp = async () => {
    if (!formData.email) return showSnackbar("Enter email ❌", "error");

    try {
      await sendOtp(formData.email);
      showSnackbar("OTP sent ✅");

      setOtpSent(true);
      setOtpVerified(false);

      setTimer(30);
      setIsResendDisabled(true);

    } catch {
      showSnackbar("Failed ❌", "error");
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!formData.otp) return showSnackbar("Enter OTP ❌", "error");

    try {
      await verifyOtp({
        email: formData.email,
        otp: formData.otp
      });

      showSnackbar("OTP verified ✅");

      setOtpVerified(true);
      setTimer(0); // stop timer

    } catch (err) {
      showSnackbar(err?.response?.data || "Invalid OTP ❌", "error");
    }
  };

  // ✅ RESEND OTP
  const handleResendOtp = async () => {
    if (otpVerified) return;

    try {
      await sendOtp(formData.email);
      showSnackbar("OTP resent ✅");

      setTimer(30);
      setIsResendDisabled(true);
      setOtpVerified(false);

    } catch {
      showSnackbar("Failed ❌", "error");
    }
  };

  // ✅ REGISTER (FIXED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.otp   // ✅ IMPORTANT
      });

      showSnackbar("Registered successfully ✅");
      setTimeout(() => navigate("/login"), 1000);

    } catch (err) {
      showSnackbar(err?.response?.data || "Registration failed ❌", "error");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" textAlign="center">
          Create Account 🚀
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <TextField fullWidth label="Name" name="name"
            error={!!errors.name} helperText={errors.name}
            onChange={handleChange} sx={{ mb: 2 }}/>

          {/* EMAIL */}
          <Box display="flex" gap={2}>
            <TextField fullWidth label="Email" name="email"
              error={!!errors.email} helperText={errors.email}
              onChange={handleChange}/>

            <Button
              variant="outlined"
              onClick={handleSendOtp}
              disabled={otpSent}
              sx={{ borderColor:"#4CAF50", color:"#4CAF50" }}
            >
              {otpSent ? "Sent" : "Send OTP"}
            </Button>
          </Box>

          {/* OTP */}
          <Box display="flex" gap={2} sx={{ mt: 2 }}>
            <TextField fullWidth label="OTP" name="otp"
              error={!!errors.otp} helperText={errors.otp}
              onChange={handleChange}
              disabled={otpVerified}
            />

            <Button
              variant="contained"
              onClick={handleVerifyOtp}
              disabled={otpVerified}
              sx={{ background:"#4CAF50" }}
            >
              {otpVerified ? "Verified" : "Verify"}
            </Button>
          </Box>

          {/* RESEND */}
          {otpSent && (
            <Button
              fullWidth
              onClick={handleResendOtp}
              disabled={isResendDisabled || otpVerified}
              sx={{ mt:2, border:"1px solid #4CAF50", color:"#4CAF50" }}
            >
              {otpVerified
                ? "OTP Verified"
                : isResendDisabled
                  ? `Resend in ${timer}s`
                  : "Resend OTP"}
            </Button>
          )}

          {/* PASSWORD */}
          <TextField fullWidth label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            error={!!errors.password}
            helperText={errors.password || "Use strong password"}
            onChange={handleChange}
            sx={{ mt:2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={()=>setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* CONFIRM */}
          <TextField fullWidth label="Confirm Password" 
            name="confirmPassword"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            onChange={handleChange}
            sx={{ mt:2 }}/>

          {/* REGISTER */}
          <Button fullWidth type="submit"
            disabled={!otpVerified}
            sx={{ mt:3, background:"#4CAF50", color:"#fff" }}>
            Register
          </Button>

          <Typography mt={2} textAlign="center">
            Already have account?{" "}
            <Link
              to="/login"
              style={{
                color: "#4CAF50",
                fontWeight: "bold",
                textDecoration: "none"
              }}
            >
              Login
            </Link>
          </Typography>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "top" }}
        sx={{ mt: 8 }} // 🔥 push it below navbar & above form
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Register;