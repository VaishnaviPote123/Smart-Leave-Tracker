const express = require("express");
const router = express.Router();
const leavesController = require("../controllers/leavesController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

// 🔹 All logged-in users can fetch leaves
router.get("/", authenticate, leavesController.getLeaves);

// 🔹 Employee can request leave
router.post("/", authenticate, authorizeRoles("employee"), leavesController.requestLeave);

// 🔹 Manager/Admin can approve/reject leaves
router.put("/:id", authenticate, authorizeRoles("manager", "admin"), leavesController.updateLeaveStatus);

module.exports = router;
