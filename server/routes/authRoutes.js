const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "mediqueue_secure_jwt_secret_2026";

// In-memory OTP storage for mobile verification
const otpStore = new Map();

// ==================== GET DEMO PATIENTS ====================
router.get("/demo-patients", (req, res) => {
  res.json({
    success: true,
    patients: [
      {
        id: 1,
        name: "Aarav Sharma",
        phone: "9876543210",
        email: "aarav@example.com",
        bloodGroup: "O+",
        activeToken: "A-27",
        department: "Cardiology",
        doctor: "Dr. Amit Sharma",
      },
      {
        id: 2,
        name: "Diya Patel",
        phone: "9876543211",
        email: "diya@example.com",
        bloodGroup: "A+",
        activeToken: "B-14",
        department: "General Medicine",
        doctor: "Dr. Priya Deshmukh",
      },
      {
        id: 3,
        name: "Rajesh Kumar",
        phone: "9876543212",
        email: "rajesh@example.com",
        bloodGroup: "B+",
        activeToken: "C-08",
        department: "Orthopedics",
        doctor: "Dr. Rajesh Patel",
      },
    ],
  });
});

// ==================== SEND MOBILE OTP ====================
router.post("/send-otp", (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);
    // In production, integrate SMS gateway (Twilio, Gupshup, etc.)
    // For local & hackathon demo, we generate a known code and also allow 123456
    const otp = "123456";
    otpStore.set(cleanPhone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    res.json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone}. Use code 123456 for testing.`,
      phone: cleanPhone,
      demoOtp: "123456",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP.",
      error: error.message,
    });
  }
});

// ==================== VERIFY MOBILE OTP ====================
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    const cleanPhone = (phone || "").replace(/[^0-9]/g, "").slice(-10);

    if (!cleanPhone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP code are required.",
      });
    }

    // Check OTP: Allow 123456 or stored OTP
    const stored = otpStore.get(cleanPhone);
    const isValid = otp === "123456" || (stored && stored.otp === otp && stored.expiresAt > Date.now());

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code. Use 123456 to test.",
      });
    }

    otpStore.delete(cleanPhone);

    // Look up or auto-create patient user
    let user = null;
    if (db.store) {
      user = db.store.users.find((u) => u.phone === cleanPhone);
      if (!user) {
        const id = db.store.users.length + 1;
        const patientName = name || `Patient ${cleanPhone.slice(-4)}`;
        user = {
          id,
          name: patientName,
          phone: cleanPhone,
          email: `${cleanPhone}@patient.smartcare.local`,
          role: "patient",
          created_at: new Date().toISOString(),
        };
        db.store.users.push(user);
        db.store.patients.push({
          id: db.store.patients.length + 1,
          user_id: id,
          name: patientName,
          phone: cleanPhone,
          email: user.email,
          created_at: new Date().toISOString(),
        });
        db.save();
      }
    } else {
      user = {
        id: 99,
        name: name || `Patient ${cleanPhone.slice(-4)}`,
        phone: cleanPhone,
        email: `${cleanPhone}@patient.smartcare.local`,
        role: "patient",
      };
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, phone: user.phone },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Mobile login verified successfully!",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "OTP verification failed.",
      error: error.message,
    });
  }
});

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role = "patient" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing
    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [cleanEmail]
    );

    if (existingUser.rows && existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, phone, created_at`,
      [name.trim(), cleanEmail, hashedPassword, role, phone || null]
    );

    const user = result.rows[0];

    // Auto-create patient record
    if (user.role === "patient") {
      await db.query(
        `INSERT INTO patients (user_id, name, email, phone)
         VALUES ($1, $2, $3, $4)`,
        [user.id, user.name, user.email, user.phone]
      );
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed.",
      error: error.message,
    });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const result = await db.query(
      "SELECT id, name, email, phone, password_hash, role FROM users WHERE email = $1",
      [cleanEmail]
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    // Allow test bypass with password123 or demo hash or valid bcrypt
    let passwordMatch = false;
    if (password === "password123") {
      passwordMatch = true;
    } else if (user.password_hash) {
      passwordMatch = await bcrypt.compare(password, user.password_hash).catch(() => false);
    }

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
});

module.exports = router;
