const db = require("../db");

// 🔹 Get leaves (role-based + employee info)
exports.getLeaves = (req, res) => {
  const user = req.user;
  let params = [];

  let query = `
    SELECT l.id, l.user_id, l.type, l.start_date, l.end_date, l.reason, l.status,
           u.name AS employee_name, u.email
    FROM leaves l
    JOIN users u ON l.user_id = u.id
  `;

  if (user.role.toLowerCase() === "employee") {
    query += " WHERE l.user_id = ?";
    params.push(user.id);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// 🔹 Employee: Request leave
exports.requestLeave = (req, res) => {
  const { type, start_date, end_date, reason } = req.body;

  if (!type || !start_date || !end_date || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (new Date(end_date) < new Date(start_date)) {
    return res.status(400).json({ error: "End date cannot be before start date" });
  }

  const sql = `
    INSERT INTO leaves (user_id, type, start_date, end_date, reason, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `;

  db.query(sql, [req.user.id, type, start_date, end_date, reason], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(
      `
      SELECT l.id, l.user_id, l.type, l.start_date, l.end_date, l.reason, l.status,
             u.name AS employee_name, u.email
      FROM leaves l
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
      `,
      [result.insertId],
      (err2, leave) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({
          message: "Leave requested successfully",
          leave: leave[0],
        });
      }
    );
  });
};

// 🔹 Manager/Admin: Update leave status
exports.updateLeaveStatus = (req, res) => {
  const { status } = req.body;
  const leaveId = req.params.id;

  const validStatuses = ["approved", "rejected"];
  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const sql = "UPDATE leaves SET status = ? WHERE id = ?";

  db.query(sql, [status.toLowerCase(), leaveId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Leave not found" });
    }

    db.query(
      `
      SELECT l.id, l.user_id, l.type, l.start_date, l.end_date, l.reason, l.status,
             u.name AS employee_name, u.email
      FROM leaves l
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
      `,
      [leaveId],
      (err2, leave) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({
          message: `Leave status updated to ${status}`,
          leave: leave[0],
        });
      }
    );
  });
};
