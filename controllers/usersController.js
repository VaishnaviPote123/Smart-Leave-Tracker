const bcrypt = require("bcrypt");
const db = require("../db"); // your database connection

// GET all users
exports.getAllUsers = (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// GET single user
exports.getUser = (req, res) => {
  const { id } = req.params;
  db.query("SELECT id, name, email, role FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ error: "User not found" });
    res.json(result[0]);
  });
};

// ADD new user
exports.addUser = (req, res) => {
  const user = req.user;
  const { name, email, password, role } = req.body;

  if (!["admin", "manager"].includes(user.role.toLowerCase())) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (user.role.toLowerCase() === "manager" && role.toLowerCase() === "admin") {
    return res.status(403).json({ error: "Managers cannot add Admin users" });
  }

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role.toLowerCase()],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User added successfully", userId: result.insertId });
    }
  );
};

// UPDATE user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  db.query(
    "UPDATE users SET name=?, email=?, role=? WHERE id=?",
    [name, email, role, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User updated successfully" });
    }
  );
};

// DELETE user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted successfully" });
  });
};
