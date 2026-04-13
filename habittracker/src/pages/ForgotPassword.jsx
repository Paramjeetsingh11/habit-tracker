// src/pages/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert
} from "@mui/material";
import { sendOtp, resetPassword, verifyOtp } from "../api/userApi";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const showSnackbar = (msg, type = "success") => {
    setSnackbar({ open: true, message: msg, severity: type });
  };

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 TIMER
  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [timer]);

  // ✅ VALIDATION STEP 1
  const validateStep1 = () => {
    let err = {};

    if (!formData.email) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = "Enter valid email";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ VALIDATION STEP 2
  const validateStep2 = () => {
    let err = {};

    if (!formData.otp) {
      err.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(formData.otp)) {
      err.otp = "OTP must be 6 digits";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ VALIDATION STEP 3 (UPDATED 🔥)
  const validateStep3 = () => {
    let err = {};

    // 🔥 STRONG PASSWORD VALIDATION
    if (!formData.newPassword) {
      err.newPassword = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(formData.newPassword)
    ) {
      err.newPassword =
        "Must include uppercase, lowercase, number & special character";
    }

    if (!formData.confirmPassword) {
      err.confirmPassword = "Confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ SEND OTP
  const handleSendOtp = async () => {
    if (!validateStep1()) return;

    try {
      await sendOtp(formData.email);
      showSnackbar("OTP sent ✅");

      setStep(2);
      setTimer(30);
      setIsResendDisabled(true);

    } catch {
      showSnackbar("Failed to send OTP ❌", "error");
    }
  };

  // 🔥 RESEND OTP
  const handleResendOtp = async () => {
    try {
      await sendOtp(formData.email);
      showSnackbar("OTP resent ✅");

      setTimer(30);
      setIsResendDisabled(true);
    } catch {
      showSnackbar("Failed ❌", "error");
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!validateStep2()) return;

    try {
      await verifyOtp({
        email: formData.email,
        otp: formData.otp
      });

      showSnackbar("OTP verified ✅");
      setStep(3);
    } catch (err) {
      showSnackbar(err?.response?.data || "Invalid OTP ❌", "error");
    }
  };

  // ✅ RESET PASSWORD
  const handleResetPassword = async () => {
    if (!validateStep3()) return;

    try {
      await resetPassword({
        email: formData.email,
        newPassword: formData.newPassword
      });

      showSnackbar("Password updated successfully ✅");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      showSnackbar(err?.response?.data || "Error ❌", "error");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4, borderRadius: "12px" }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          Reset Password 🔐
        </Typography>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <TextField
              fullWidth
              label="Email"
              name="email"
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            <Button
              fullWidth
              onClick={handleSendOtp}
              sx={{
                mt: 3,
                backgroundColor: "#4CAF50",
                color: "#fff",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#43A047" }
              }}
            >
              Send OTP
            </Button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <TextField
              fullWidth
              label="Enter OTP"
              name="otp"
              onChange={handleChange}
              error={!!errors.otp}
              helperText={errors.otp}
            />

            <Button
              fullWidth
              onClick={handleVerifyOtp}
              sx={{
                mt: 3,
                backgroundColor: "#4CAF50",
                color: "#fff",
                borderRadius: "8px"
              }}
            >
              Verify OTP
            </Button>

            <Button
              fullWidth
              onClick={handleResendOtp}
              disabled={isResendDisabled}
              sx={{
                mt: 2,
                border: "1px solid #4CAF50",
                color: "#4CAF50"
              }}
            >
              {isResendDisabled
                ? `Resend OTP in ${timer}s`
                : "Resend OTP"}
            </Button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              onChange={handleChange}
              error={!!errors.newPassword}
              helperText={
                errors.newPassword ||
                "Use uppercase, lowercase, number & special character"
              }
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            <Button
              fullWidth
              onClick={handleResetPassword}
              sx={{
                mt: 3,
                backgroundColor: "#4CAF50",
                color: "#fff",
                borderRadius: "8px"
              }}
            >
              Reset Password
            </Button>
          </>
        )}
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ForgotPassword;