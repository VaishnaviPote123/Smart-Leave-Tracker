import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>SmartLeaveTracker</h2>
      <ul style={styles.ul}>
        <li>
          <Link to="/" style={styles.link}>Home</Link>
        </li>

        {!user && (
          <>
            <li>
              <Link to="/login" style={styles.link}>Login</Link>
            </li>
            <li>
              <Link to="/register" style={styles.link}>Register</Link>
            </li>
          </>
        )}

        {user && user.role.toLowerCase() === "employee" && (
          <li>
            <Link to="/employee/leaves" style={styles.link}>My Leaves</Link>
          </li>
        )}

        {user && (user.role.toLowerCase() === "manager" || user.role.toLowerCase() === "admin") && (
          <li>
            <Link to="/manager/leaves" style={styles.link}>Manage Leaves</Link>
          </li>
        )}

        {user && user.role.toLowerCase() === "admin" && (
          <>
            <li>
              <Link to="/users" style={styles.link}>Users</Link>
            </li>
            <li>
              <Link to="/add-user" style={styles.link}>Add User</Link>
            </li>
          </>
        )}

        {user && (
          <li>
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#42a0c0ff",
    color: "#fff",
  },
  logo: {
    margin: 0,
  },
  ul: {
    listStyle: "none",
    display: "flex",
    gap: "15px",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  logoutButton: {
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default Navbar;
