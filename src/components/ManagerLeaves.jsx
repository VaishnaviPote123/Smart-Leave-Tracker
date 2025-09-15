import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ManagerLeaves = () => {
  const { user, token } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch leaves + users when token is available
  useEffect(() => {
    if (token) {
      fetchLeaves();
      if (["manager", "admin"].includes(user.role.toLowerCase())) {
        fetchUsers();
      }
    }
  }, [token]);

  // ===== Leaves =====
  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch leaves");
    }
  };

  const handleStatusChange = async (leaveId, status) => {
    setError("");
    setSuccess("");
    try {
      await axios.put(
        `http://localhost:5000/api/leaves/${leaveId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Leave ${status} successfully!`);
      setLeaves((prev) =>
        prev.map((l) => (l.id === leaveId ? { ...l, status } : l))
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update leave status");
    }
  };

  // ===== Users =====
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Managers cannot add Admin users
    if (user.role.toLowerCase() === "manager" && form.role.toLowerCase() === "admin") {
      setError("Managers cannot add Admin users");
      setSuccess("");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("User added successfully!");
      setError("");
      setForm({ name: "", email: "", password: "", role: "employee" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to add user");
      setSuccess("");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        background:
          user.role.toLowerCase() === "admin"
            ? "linear-gradient(135deg, #ffe29f, #ffa99f)"
            : "linear-gradient(135deg, #d4fc79, #96e6a1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "1100px",
        }}
      >
        {/* ===== Leaves Section ===== */}
        <h2>
          {user.role.toLowerCase() === "admin"
            ? "All Leaves (Admin View)"
            : "Manage Leaves"}
        </h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Employee</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Start</th>
              <th style={styles.th}>End</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "10px" }}>
                  No leave requests found.
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id}>
                  <td style={styles.td}>{leave.employee_name}</td>
                  <td style={styles.td}>{leave.email}</td>
                  <td style={styles.td}>{leave.employee_role}</td>
                  <td style={styles.td}>{leave.type}</td>
                  <td style={styles.td}>{leave.start_date}</td>
                  <td style={styles.td}>{leave.end_date}</td>
                  <td style={styles.td}>{leave.reason}</td>
                  <td
                    style={{
                      ...styles.td,
                      color:
                        leave.status === "approved"
                          ? "green"
                          : leave.status === "rejected"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {leave.status}
                  </td>
                  <td style={styles.td}>
                    {["manager", "admin"].includes(user.role.toLowerCase()) &&
                    leave.employee_role === "employee" &&
                    leave.status === "pending" ? (
                      <>
                        <button
                          style={{ marginRight: "5px" }}
                          onClick={() => handleStatusChange(leave.id, "approved")}
                        >
                          Approve
                        </button>
                        <button onClick={() => handleStatusChange(leave.id, "rejected")}>
                          Reject
                        </button>
                      </>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ===== Users Section (Manager/Admin Only) ===== */}
        {["manager", "admin"].includes(user.role.toLowerCase()) && (
          <div style={{ marginTop: "40px" }}>
            <h2>Manage Users</h2>

            <form
              onSubmit={handleAddUser}
              style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
            >
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                {user.role.toLowerCase() === "admin" && <option value="admin">Admin</option>}
              </select>
              <button type="submit">Add User</button>
            </form>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "10px" }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td style={styles.td}>{u.name}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>{u.role}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    border: "1px solid #87d791ff",
    padding: "8px",
    backgroundColor: "#d8ec68ff",
  },
  td: {
    border: "1px solid #a89fd4ff",
    padding: "8px",
  },
};

export default ManagerLeaves;
