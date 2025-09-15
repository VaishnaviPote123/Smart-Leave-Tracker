const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const db = require("./db");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const leavesRoutes = require("./routes/leaves");

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/leaves", leavesRoutes);

app.get("/", (req, res) => res.send("Backend running ✅"));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
