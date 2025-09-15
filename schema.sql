-- 1️⃣ Create Database
CREATE DATABASE IF NOT EXISTS leave_tracker;

-- 2️⃣ Use the database
USE leave_tracker;

-- 3️⃣ Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('employee', 'admin') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users 
MODIFY role ENUM('Employee', 'Admin', 'Manager', 'Developer','Tester') DEFAULT 'Employee';

ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN token_expiry DATETIME NULL;

ALTER TABLE users ADD COLUMN reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN reset_token_expires BIGINT;

SELECT email FROM users;


DESCRIBE users;

ALTER TABLE users DROP PRIMARY KEY, DROP COLUMN id;

-- 4️⃣ Create Leaves Table
CREATE TABLE IF NOT EXISTS leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('sick', 'vacation', 'casual', 'other') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5️⃣ Optional: Create Auth Tokens Table (if using JWT refresh tokens)
CREATE TABLE IF NOT EXISTS auth_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 6️⃣ Insert Sample Users
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@leavetracker.com', 'admin123', 'admin'),
('Employee One', 'employee1@leavetracker.com', 'password1', 'employee'),
('Employee Two', 'employee2@leavetracker.com', 'password2', 'employee');
INSERT INTO users (name, email, password, role)
VALUES
('Employee Three', 'employee3@leavetracker.com', 'password3', 'employee');

DELETE FROM users;
ALTER TABLE users AUTO_INCREMENT = 1;
INSERT INTO users (id, name, email, password, role)
VALUES
(1, 'Alice Johnson', 'alice@example.com', 'hashed_password1', 'employee'),
(2, 'Bob Smith', 'bob@example.com', 'hashed_password2', 'employee'),
(3, 'Charlie Brown', 'charlie@example.com', 'hashed_password3', 'employee'),
(4, 'Diana Prince', 'diana@example.com', 'hashed_password4', 'admin');



SET SQL_SAFE_UPDATES = 0;

UPDATE users SET user_id = id;

SELECT * FROM users;

-- 7️⃣ Insert Sample Leave Requests
INSERT INTO leaves (user_id, type, start_date, end_date, status, reason)
VALUES
(2, 'sick', '2025-09-01', '2025-09-03', 'approved', 'Fever and rest'),
(3, 'vacation', '2025-09-10', '2025-09-15', 'pending', 'Family trip'),
(4, 'casual', '2025-09-05', '2025-09-05', 'approved', 'Personal work'),
(2, 'other', '2025-09-20', '2025-09-22', 'rejected', 'Unspecified reason');


SELECT 
    l.id AS leave_id,
    u.name AS employee_name,
    u.email,
    l.type AS leave_type,
    l.start_date,
    l.end_date,
    l.status,
    l.reason,
    l.created_at
FROM leaves l
JOIN users u ON l.user_id = u.id
ORDER BY l.created_at DESC;

SELECT 
    l.id AS leave_id,
    u.name AS employee_name,
    u.email,
    l.type AS leave_type,
    l.start_date,
    l.end_date,
    l.reason,
    l.created_at
FROM leaves l
JOIN users u ON l.user_id = u.id
WHERE l.status = 'pending'
ORDER BY l.created_at DESC;

UPDATE leaves
SET status = 'approved'
WHERE id = 1;

UPDATE leaves
SET status = 'rejected'
WHERE id = 2;

SELECT * FROM leaves WHERE status = 'pending';
SELECT * FROM leaves;
