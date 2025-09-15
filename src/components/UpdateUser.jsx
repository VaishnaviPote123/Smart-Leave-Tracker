import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateUser = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", email: "", role: "employee" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({ name: res.data.name, email: res.data.email, role: res.data.role });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/users/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Update User</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Update User</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
