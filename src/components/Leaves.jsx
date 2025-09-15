import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Leaves = () => {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [newLeave, setNewLeave] = useState({ start_date: "", end_date: "", reason: "" });

  const fetchLeaves = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/leaves", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLeaves(res.data);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleChange = e => setNewLeave({ ...newLeave, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/leaves", newLeave, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLeaves();
      setNewLeave({ start_date: "", end_date: "", reason: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/leaves/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Leaves</h2>

      {user.role === "employee" && (
        <form onSubmit={handleSubmit}>
          <input type="date" name="start_date" value={newLeave.start_date} onChange={handleChange} required />
          <input type="date" name="end_date" value={newLeave.end_date} onChange={handleChange} required />
          <input type="text" name="reason" placeholder="Reason" value={newLeave.reason} onChange={handleChange} required />
          <button type="submit">Request Leave</button>
        </form>
      )}

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Start</th>
            <th>End</th>
            <th>Reason</th>
            <th>Status</th>
            {user.role === "manager" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave.id}>
              <td>{leave.id}</td>
              <td>{leave.user_id}</td>
              <td>{leave.start_date}</td>
              <td>{leave.end_date}</td>
              <td>{leave.reason}</td>
              <td>{leave.status}</td>
              {user.role === "manager" && leave.status === "pending" && (
                <td>
                  <button onClick={() => handleStatus(leave.id, "approved")}>Approve</button>
                  <button onClick={() => handleStatus(leave.id, "rejected")}>Reject</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaves;
