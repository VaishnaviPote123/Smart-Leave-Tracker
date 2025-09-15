import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import EmployeeLeaves from "./components/EmployeeLeaves";
import ManagerLeaves from "./components/ManagerLeaves";
import Users from "./components/Users";
import AddUser from "./components/AddUser";
import UpdateUser from "./components/UpdateUser";
import DeleteUser from "./components/DeleteUser";

import { AuthContext, AuthProvider } from "./context/AuthContext";

// ProtectedRoute wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />; // Not logged in
  if (roles && !roles.includes(user.role.toLowerCase())) return <Navigate to="/" />; // Role not allowed

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Employee routes */}
        <Route
          path="/employee/leaves"
          element={
            <ProtectedRoute roles={["employee"]}>
              <EmployeeLeaves />
            </ProtectedRoute>
          }
        />

        {/* Manager/Admin routes */}
        <Route
          path="/manager/leaves"
          element={
            <ProtectedRoute roles={["manager", "admin"]}>
              <ManagerLeaves />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-user"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-user/:id"
          element={
            <ProtectedRoute roles={["admin"]}>
              <UpdateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delete-user/:id"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DeleteUser />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
