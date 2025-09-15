const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@1234",
  database: "leave_tracker",
  port: "3306"
});

db.connect(err => {
  if (err) console.error("❌ DB Connection Failed:", err);
  else console.log("✅ Database connected");
});

module.exports = db;
