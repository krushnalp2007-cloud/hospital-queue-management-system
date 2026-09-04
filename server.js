const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const queueRoutes = require("./routes/queueRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/resources", resourceRoutes);

// Home / health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SmartCare Hospital Queue API is running!",
    });
});

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend is working correctly!",
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});