// controllers/userController.js
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ================= REGISTER USER =================
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("All fields required ❌");
  }

  try {
    // 🔥 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("User already exists or error ❌");
      }

      res.send("User registered successfully ✅");
    });

  } catch (err) {
    res.status(500).send("Error hashing password ❌");
  }
};
// ================= LOGIN USER =================

// LOGIN USER WITH JWT
// ================= LOGIN USER =================
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length === 0) {
      return res.status(401).send("Invalid credentials ❌");
    }

    const user = result[0];

    let isMatch = false;

    // 🔥 CHECK: hashed or plain
    if (user.password.startsWith("$2b$")) {
      // hashed
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // plain text (old users)
      isMatch = password === user.password;
    }

    if (!isMatch) {
      return res.status(401).send("Invalid credentials ❌");
    }

    // ✅ OPTIONAL: upgrade old password to hashed
    if (!user.password.startsWith("$2b$")) {
      const hashed = await bcrypt.hash(password, 10);
      db.query("UPDATE users SET password=? WHERE id=?", [hashed, user.id]);
    }

    delete user.password;

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user
    });
  });
};

// ================= GET USERS =================
exports.getAllUsers = (req, res) => {
  const sql = "SELECT id, name, email, created_at FROM users";

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching users ❌");
    }

    res.json(result);
  });
};

// ================= DELETE USER =================
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error deleting user ❌");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("User not found ❌");
    }

    res.send("User deleted successfully 🗑️");
  });
};

// ================= FORGOT PASSWORD =================
// 🔥 OTP ALREADY VERIFIED IN FRONTEND → NO NEED AGAIN
// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).send("Email and new password required ❌");
  }

  const checkSql = "SELECT * FROM users WHERE email = ?";

  db.query(checkSql, [email], async (err, result) => {
    if (err) return res.status(500).send("Server error ❌");

    if (result.length === 0) {
      return res.status(404).send("User not registered ❌");
    }

    try {
      // 🔥 HASH NEW PASSWORD
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updateSql = "UPDATE users SET password = ? WHERE email = ?";

      db.query(updateSql, [hashedPassword, email], (err) => {
        if (err) return res.status(500).send("Error updating password ❌");

        res.send("Password updated successfully ✅");
      });

    } catch {
      res.status(500).send("Error hashing password ❌");
    }
  });
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).send("Email and new password required ❌");
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sql = "UPDATE users SET password = ? WHERE email = ?";

    db.query(sql, [hashedPassword, email], (err) => {
      if (err) {
        return res.status(500).send("Error updating password ❌");
      }

      res.send("Password reset successful ✅");
    });

  } catch {
    res.status(500).send("Error hashing password ❌");
  }
};