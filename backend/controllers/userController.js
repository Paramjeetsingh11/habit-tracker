const db = require("../db");

// REGISTER USER
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("All fields required ❌");
  }

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("User already exists or error ❌");
    }

    res.send("User registered ✅");
  });
};

// LOGIN USER
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length === 0) {
      return res.status(401).send("Invalid credentials ❌");
    }

    res.json(result[0]); // return user data
  });
};
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

// DELETE USER
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
