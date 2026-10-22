const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const queueRoutes = require("./routes/queueRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const patientRoutes = require("./routes/patients");
const appointmentRoutes = require("./routes/appointments");

const app = express();

app.use(cors());
app.use(express.json());

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "MediQueue API",
    version: "2.0.0",
    message: "Smart Hospital Queue & Patient Management Backend is running smoothly!",
    database: db.isPostgres ? "PostgreSQL (Live)" : "High-Availability In-Memory Store",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is operational!",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 MediQueue Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`📡 Database mode: ${db.isPostgres ? "PostgreSQL" : "High-Availability In-Memory Fallback"}`);
});

module.exports = app;
