const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ==================== GET ALL PATIENTS ====================
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        p.id,
        p.user_id,
        p.name,
        p.email,
        p.phone,
        p.date_of_birth,
        p.gender,
        p.address,
        p.created_at
      FROM patients p
      ORDER BY p.id ASC;
    `);

    const patients = (result.rows || []).map((patient) => {
      const parts = (patient.name || "").trim().split(/\s+/);
      let initials = "?";
      if (parts.length === 1 && parts[0]) {
        initials = parts[0].slice(0, 2).toUpperCase();
      } else if (parts.length > 1) {
        initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }

      return {
        ...patient,
        initials,
      };
    });

    res.json(patients);
  } catch (error) {
    console.error("GET patients error:", error);
    res.status(500).json({ message: "Failed to fetch patients", error: error.message });
  }
});

// ==================== CREATE PATIENT ====================
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, date_of_birth, gender, address } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Patient name is required." });
    }

    const result = await db.query(
      `INSERT INTO patients (name, email, phone, date_of_birth, gender, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, phone, date_of_birth, gender, address, created_at`,
      [name.trim(), email || null, phone || null, date_of_birth || null, gender || null, address || null]
    );

    res.status(201).json({
      message: "Patient registered successfully.",
      patient: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create patient", error: error.message });
  }
});

module.exports = router;
