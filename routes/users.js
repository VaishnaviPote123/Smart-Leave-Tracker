const express = require("express");
const router = express.Router();
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { getAllUsers, getUser, addUser, updateUser, deleteUser } = require("../controllers/usersController");

// Admin + Manager can see all users
router.get("/", authenticate, authorizeRoles("admin", "manager"), getAllUsers);

// Any logged-in user can view their profile
router.get("/:id", authenticate, getUser);

// Admin + Manager can add users
router.post("/", authenticate, authorizeRoles("admin", "manager"), addUser);

// Admin + Manager can update users
router.put("/:id", authenticate, authorizeRoles("admin", "manager"), updateUser);

// Only Admin can delete users
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteUser);

module.exports = router;
