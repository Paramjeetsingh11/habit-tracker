const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// REGISTER
router.post("/register", userController.registerUser);

// LOGIN
router.post("/login", userController.loginUser);

router.get("/users", userController.getAllUsers);

router.delete("/delete-user/:id", userController.deleteUser);

module.exports = router;