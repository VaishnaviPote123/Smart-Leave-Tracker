// frontend/src/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);

  // Fetch all leaves when component loads
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/leaves");
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/leaves/${id}`, { status });
      alert(`Leave ${status}`);
      fetchLeaves(); // refresh after update
    } catch (err) {
      console.error("Error updating leave:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard - Manage Leaves</h2>
      {leaves.length === 0 ? (
        <p>No leave requests found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.id}</td>
                <td>{leave.user_id}</td>
                <td>{leave.type}</td>
                <td>{leave.start_date}</td>
                <td>{leave.end_date}</td>
                <td>{leave.status}</td>
                <td>{leave.reason}</td>
                <td>
                  {leave.status === "pending" ? (
                    <>
                      <button onClick={() => updateStatus(leave.id, "approved")}>
                        Approve
                      </button>
                      <button onClick={() => updateStatus(leave.id, "rejected")}>
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>{leave.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
