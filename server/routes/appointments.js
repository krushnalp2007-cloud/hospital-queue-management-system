const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ==================== GET ALL APPOINTMENTS ====================
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        a.id,
        a.patient_id,
        a.doctor_id,
        a.department_id,
        a.appointment_date,
        a.appointment_time,
        a.token_number,
        a.priority,
        a.status,
        a.created_at,
        p.name AS patient_name,
        p.email AS patient_email,
        p.phone AS patient_phone,
        d.name AS department,
        doc.name AS doctor_name,
        doc.room AS doctor_room,
        q.id AS queue_id,
        q.status AS queue_status,
        q.patients_ahead,
        q.estimated_wait_time,
        q.called_at,
        q.completed_at
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN departments d ON d.id = a.department_id
      LEFT JOIN doctors doc ON doc.id = a.doctor_id
      LEFT JOIN queue q ON q.appointment_id = a.id
      ORDER BY a.id DESC;
    `);

    res.json({
      success: true,
      appointments: result.rows || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments.",
      error: error.message,
    });
  }
});

module.exports = router;
