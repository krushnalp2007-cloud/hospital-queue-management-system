const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ==================== GET EMERGENCIES ====================
router.get("/", (req, res) => {
  const emergencies = db.store ? db.store.emergencies : [];
  res.json({
    success: true,
    totalEmergencies: emergencies.length,
    emergencies,
  });
});

// ==================== CREATE EMERGENCY ALERT ====================
router.post("/alert", (req, res) => {
  try {
    const {
      patientName,
      department = "Emergency Care",
      ambulanceEta = 10,
      icuRequired = false,
      bedRequired = true,
      condition = "Acute trauma / chest pain",
    } = req.body;

    if (!patientName) {
      return res.status(400).json({
        success: false,
        message: "Patient name is required.",
      });
    }

    const newAlert = {
      id: Date.now().toString(),
      patientName,
      department,
      ambulanceEta: Number(ambulanceEta),
      icuRequired: Boolean(icuRequired),
      bedRequired: Boolean(bedRequired),
      condition,
      priority: "emergency",
      status: "incoming",
      resourcesAvailable: true,
      createdAt: new Date().toISOString(),
    };

    if (db.store) {
      db.store.emergencies.unshift(newAlert);

      // Auto-insert emergency into queue with top priority
      const aptId = db.store.appointments.length + 1;
      const tokenNumber = `EMG-${Math.floor(10 + Math.random() * 90)}`;

      db.store.appointments.push({
        id: aptId,
        patient_id: 1,
        doctor_id: 1,
        department_id: 1,
        appointment_date: new Date().toISOString().split("T")[0],
        appointment_time: "NOW",
        token_number: tokenNumber,
        priority: "emergency",
        status: "waiting",
        created_at: new Date().toISOString(),
      });

      db.store.queue.unshift({
        id: db.store.queue.length + 1,
        appointment_id: aptId,
        token_number: tokenNumber,
        priority: "emergency",
        status: "waiting",
        patients_ahead: 0,
        estimated_wait_time: 0,
        called_at: null,
        completed_at: null,
        created_at: new Date().toISOString(),
      });
      db.save();
    }

    res.status(201).json({
      success: true,
      message: `Emergency Alert Dispatched for ${patientName}! Hospital team notified.`,
      emergency: newAlert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create emergency alert.",
      error: error.message,
    });
  }
});

// ==================== UPDATE EMERGENCY STATUS ====================
router.patch("/:id/status", (req, res) => {
  const { status } = req.body;
  if (db.store) {
    const alert = db.store.emergencies.find((e) => e.id === req.params.id);
    if (alert) {
      alert.status = status;
      return res.json({ success: true, message: "Emergency status updated", emergency: alert });
    }
  }
  res.json({ success: true, message: "Status updated" });
});

module.exports = router;
