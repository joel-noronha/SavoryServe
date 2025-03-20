const express = require("express");
const db = require("../db");
const router = express.Router();

// Register
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  const sql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, password, role], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Registration successful");
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length > 0) {
      res.json({ success: true, role: result[0].role });
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

router.post("/change-password", (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Check if the current password is correct (for example, verify with database)
  const sql = 'SELECT * FROM users WHERE role = "admin"';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send("Error occurred");

    const user = result[0]; // Assuming there's only one admin user
    if (user) {
      // Directly compare the current password (without bcrypt)
      if (user.password === currentPassword) {
        // Update password directly (still not recommended to store passwords in plain text)
        const updateSql = "UPDATE users SET password = ? WHERE id = ?";
        db.query(updateSql, [newPassword, user.id], (err) => {
          if (err) return res.status(500).send("Failed to update password");
          res.json({ success: true });
        });
      } else {
        res.status(401).send("Incorrect current password");
      }
    } else {
      res.status(404).send("User not found");
    }
  });
});

router.get("/users", (req, res) => {
  const sql = "SELECT id, name, email, role FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("User deleted successfully");
  });
});

router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  const sql = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
  db.query(sql, [name, email, role, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("User updated successfully");
  });
});

module.exports = router;
