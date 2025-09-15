# Smart-Leave-Tracker
A role-based Smart Leave Tracker System built with React (frontend) and Node.js + Express + MySQL (backend). The system allows employees to request leaves and enables managers and admins to manage leave requests and users efficiently.
🚀 **Smart Leave Tracker** is a full-stack **Leave Management System** built with **React, Node.js, Express, and MySQL**.  
It helps organizations streamline leave requests and approvals with **secure role-based access control**.

## ✨ Features

- 👨‍💼 **Employee**
  - Request leave (type, reason, start & end date)
  - Track leave request status

- 👩‍💼 **Manager**
  - View all employee leave requests
  - Approve or reject leaves
  - Add/manage employees (cannot add Admins)

- 🛡️ **Admin**
  - Full access to all data
  - Approve/reject leaves
  - Manage employees and managers
  - Add admins, managers, or employees

- 🔒 **Authentication & Security**
  - JWT authentication
  - Passwords stored securely with bcrypt
  - Role-based authorization (Employee / Manager / Admin)

---

## 🏗️ Tech Stack

- **Frontend:** React (Axios, Context API, modern hooks)
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Auth:** JWT (JSON Web Tokens), bcrypt for password hashing
