const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ==================== GET ALL DOCTORS ====================
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        d.id,
        d.name,
        d.specialization,
        d.room,
        d.status,
        d.experience_years,
        dep.name AS department
      FROM doctors d
      LEFT JOIN departments dep ON d.department_id = dep.id
      ORDER BY d.id;
    `);

    res.json({
      success: true,
      doctors: result.rows || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors.",
      error: error.message,
    });
  }
});

// ==================== GET DOCTOR BY ID ====================
router.get("/:id", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT d.id, d.name, d.specialization, d.room, d.status, d.experience_years, dep.name AS department
       FROM doctors d
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.id = $1`,
      [req.params.id]
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, doctor: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch doctor" });
  }
});

// ==================== UPDATE DOCTOR STATUS ====================
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const docId = Number(req.params.id);

    if (db.store) {
      const doc = db.store.doctors.find((d) => d.id === docId);
      if (!doc) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }
      doc.status = status;
      db.save();
      return res.json({
        success: true,
        message: `Dr. ${doc.name} status updated to ${status}`,
        doctor: doc,
      });
    }

    const result = await db.query(
      "UPDATE doctors SET status = $1 WHERE id = $2 RETURNING id, name, status",
      [status, req.params.id]
    );

    res.json({
      success: true,
      message: "Doctor status updated",
      doctor: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

module.exports = router;
