import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DeleteUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("User deleted successfully!");
        navigate("/users");
      } catch (err) {
        console.error(err);
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div>
      <h2>Delete User</h2>
      <p>Are you sure you want to delete user ID: {id}?</p>
      <button onClick={handleDelete} style={{ background: "red", color: "white" }}>Confirm Delete</button>
      <button onClick={() => navigate("/users")}>Cancel</button>
    </div>
  );
};

export default DeleteUser;
