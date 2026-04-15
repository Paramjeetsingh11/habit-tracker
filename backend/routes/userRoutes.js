// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const otpController = require("../controllers/otpController");


// REGISTER

router.post("/send-otp", otpController.sendOtp);    
router.post("/verify-otp", otpController.verifyOtp);
router.post("/register", userController.registerUser);
router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password", userController.resetPassword);

// LOGIN
router.post("/login", userController.loginUser);

router.get("/users", userController.getAllUsers);

router.delete("/delete-user/:id", userController.deleteUser);

module.exports = router;