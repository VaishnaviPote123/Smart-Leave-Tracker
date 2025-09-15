import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EmployeeLeaves = () => {
  const { user, token } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({
    type: "sick",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch employee leaves on mount
  useEffect(() => {
    if (token) fetchLeaves();
  }, [token]);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Only include leaves for the logged-in employee
      const employeeLeaves = res.data.filter(
        (l) => l.user_id === user.id
      );
      setLeaves(employeeLeaves);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch leaves");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/api/leaves", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Leave requested successfully!");
      // Add new leave to list
      setLeaves([res.data.leave, ...leaves]);
      setForm({ type: "sick", start_date: "", end_date: "", reason: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to request leave");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Leaves</h2>

      {/* Request Leave Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <label>
          Type:
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="sick">Sick</option>
            <option value="vacation">Vacation</option>
            <option value="casual">Casual</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Start Date:
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Reason:
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Request Leave</button>
      </form>

      {/* Leave List */}
      <h3 style={{ marginTop: "30px" }}>Leave History</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No leaves found.
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.type}</td>
                <td>{leave.start_date}</td>
                <td>{leave.end_date}</td>
                <td>{leave.reason}</td>
                <td
                  style={{
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
    maxWidth: "400px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
};

export default EmployeeLeaves;
