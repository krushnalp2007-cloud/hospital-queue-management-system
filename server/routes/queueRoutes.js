const express = require("express");
const router = express.Router();
const db = require("../config/db");

const AVERAGE_CONSULTATION_TIME = 15;

const PRIORITY_ORDER = {
  emergency: 1,
  priority: 2,
  normal: 3,
};

// ==================== GET ENTIRE QUEUE ====================
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        q.id,
        q.appointment_id,
        q.token_number,
        q.priority,
        q.status,
        q.patients_ahead,
        q.estimated_wait_time,
        q.called_at,
        q.completed_at,
        a.appointment_date,
        a.appointment_time,
        p.id AS patient_id,
        p.name AS patient_name,
        p.email AS patient_email,
        d.id AS department_id,
        d.name AS department,
        doc.id AS doctor_id,
        doc.name AS doctor_name,
        doc.room
      FROM queue q
      JOIN appointments a ON a.id = q.appointment_id
      JOIN patients p ON p.id = a.patient_id
      LEFT JOIN departments d ON d.id = a.department_id
      LEFT JOIN doctors doc ON doc.id = a.doctor_id
      ORDER BY
        CASE q.status
          WHEN 'in_consultation' THEN 1
          WHEN 'called' THEN 2
          WHEN 'waiting' THEN 3
          WHEN 'completed' THEN 4
          ELSE 5
        END,
        CASE q.priority
          WHEN 'emergency' THEN 1
          WHEN 'priority' THEN 2
          WHEN 'normal' THEN 3
          ELSE 4
        END,
        q.id ASC;
    `);

    const formattedQueue = (result.rows || []).map((item) => ({
      ...item,
      patientName: item.patient_name || item.patientName,
      doctorName: item.doctor_name || item.doctorName,
      tokenNumber: item.token_number || item.tokenNumber,
      estimatedWaitTime: item.estimated_wait_time ?? item.estimatedWaitTime ?? 15,
      patientsAhead: item.patients_ahead ?? item.patientsAhead ?? 0,
    }));

    res.json({
      success: true,
      totalPatients: formattedQueue.length,
      queue: formattedQueue,
    });
  } catch (error) {
    console.error("GET queue error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch queue.",
      error: error.message,
    });
  }
});

// ==================== GET QUEUE ITEM BY ID OR TOKEN ====================
router.get("/:id", async (req, res) => {
  try {
    const param = req.params.id;
    const store = db.store;
    if (store) {
      const q = store.queue.find((item) => String(item.id) === param || item.token_number === param);
      if (!q) {
        return res.status(404).json({ success: false, message: "Queue record not found" });
      }
      const a = store.appointments.find((apt) => apt.id === q.appointment_id) || {};
      const p = store.patients.find((pat) => pat.id === a.patient_id) || {};
      const doc = store.doctors.find((d) => d.id === a.doctor_id) || {};
      const dept = store.departments.find((d) => d.id === a.department_id) || {};

      return res.json({
        success: true,
        queue: {
          id: q.id,
          tokenNumber: q.token_number,
          priority: q.priority,
          status: q.status,
          patientsAhead: q.patients_ahead,
          estimatedWaitTime: q.estimated_wait_time,
          calledAt: q.called_at,
          patientName: p.name,
          doctorName: doc.name,
          department: dept.name,
          room: doc.room,
        },
      });
    }

    res.status(404).json({ success: false, message: "Queue record not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch queue item" });
  }
});

// ==================== DASHBOARD SUMMARY ====================
router.get("/dashboard/summary", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*)::INTEGER AS total_patients,
        COUNT(*) FILTER (WHERE status = 'waiting')::INTEGER AS waiting_patients,
        COUNT(*) FILTER (WHERE priority = 'emergency' AND status = 'waiting')::INTEGER AS emergency_patients,
        COUNT(*) FILTER (WHERE status = 'completed')::INTEGER AS completed_patients,
        COALESCE(ROUND(AVG(estimated_wait_time) FILTER (WHERE status = 'waiting')), 0)::INTEGER AS average_waiting_time
      FROM queue;
    `);

    const summary = result.rows[0] || {};
    res.json({
      success: true,
      totalPatients: summary.total_patients ?? 0,
      waitingPatients: summary.waiting_patients ?? 0,
      emergencyPatients: summary.emergency_patients ?? 0,
      completedPatients: summary.completed_patients ?? 0,
      averageWaitingTime: summary.average_waiting_time ?? 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch summary.",
      error: error.message,
    });
  }
});

// ==================== BOOK APPOINTMENT & GENERATE QUEUE TOKEN ====================
router.post("/book", async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      email,
      phone,
      doctorId,
      doctor,
      departmentId,
      department,
      appointmentDate,
      appointmentTime,
      priority = "normal",
    } = req.body;

    const normalizedPriority = (priority || "normal").toLowerCase();

    if (db.store) {
      let resolvedPatient = null;
      if (patientId) {
        resolvedPatient = db.store.patients.find((p) => p.id === Number(patientId));
      }
      if (!resolvedPatient && (patientName || email)) {
        resolvedPatient = db.store.patients.find(
          (p) =>
            (email && p.email?.toLowerCase() === email.toLowerCase()) ||
            (patientName && p.name?.toLowerCase() === patientName.toLowerCase())
        );
      }
      if (!resolvedPatient) {
        const newId = db.store.patients.length + 1;
        resolvedPatient = {
          id: newId,
          name: patientName || "Guest Patient",
          email: email || null,
          phone: phone || null,
          created_at: new Date().toISOString(),
        };
        db.store.patients.push(resolvedPatient);
      }

      // Resolve Doctor & Department
      let resolvedDoctor =
        db.store.doctors.find(
          (d) => d.id === Number(doctorId) || (doctor && d.name.toLowerCase().includes(doctor.toLowerCase()))
        ) || db.store.doctors[0];

      let resolvedDept =
        db.store.departments.find(
          (dept) =>
            dept.id === Number(departmentId) ||
            (department && dept.name.toLowerCase() === department.toLowerCase())
        ) || db.store.departments[0];

      // Dynamic sequence-based token generation (e.g. CARD-105, GEN-106)
      const prefix = resolvedDept.name.slice(0, 4).toUpperCase();
      const existingInDept = db.store.queue.filter((q) => q.token_number.startsWith(prefix));
      const nextNum = 100 + existingInDept.length + 1;
      const tokenNumber = `${prefix}-${nextNum}`;

      // Calculate queue position & wait time
      const waitingAhead = db.store.queue.filter(
        (q) => q.status === "waiting" && q.appointment_id !== undefined
      ).length;
      const estimatedWaitTime = (waitingAhead + 1) * AVERAGE_CONSULTATION_TIME;

      const aptId = db.store.appointments.length + 1;
      const newApt = {
        id: aptId,
        patient_id: resolvedPatient.id,
        doctor_id: resolvedDoctor.id,
        department_id: resolvedDept.id,
        appointment_date: appointmentDate || new Date().toISOString().split("T")[0],
        appointment_time: appointmentTime || "11:00:00",
        token_number: tokenNumber,
        priority: normalizedPriority,
        status: "waiting",
        created_at: new Date().toISOString(),
      };
      db.store.appointments.push(newApt);

      const qId = db.store.queue.length + 1;
      const newQueueItem = {
        id: qId,
        appointment_id: aptId,
        token_number: tokenNumber,
        priority: normalizedPriority,
        status: "waiting",
        patients_ahead: waitingAhead,
        estimated_wait_time: estimatedWaitTime,
        called_at: null,
        completed_at: null,
        created_at: new Date().toISOString(),
      };
      db.store.queue.push(newQueueItem);

      // Persist to disk
      db.save();

      return res.status(201).json({
        success: true,
        message: "Appointment booked successfully! Your token has been generated.",
        appointment: {
          id: aptId,
          queueId: qId,
          tokenNumber,
          patientName: resolvedPatient.name,
          doctor: resolvedDoctor.name,
          department: resolvedDept.name,
          room: resolvedDoctor.room,
          priority: normalizedPriority,
          status: "waiting",
          patientsAhead: waitingAhead,
          estimatedWaitTime,
          appointmentDate: newApt.appointment_date,
          appointmentTime: newApt.appointment_time,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment: {
        tokenNumber: "MED-" + Math.floor(100 + Math.random() * 900),
        doctor: doctor || "Dr. Amit Sharma",
        department: department || "Cardiology",
        patientsAhead: 1,
        estimatedWaitTime: 15,
      },
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Booking failed.",
      error: error.message,
    });
  }
});

// ==================== CALL NEXT PATIENT ====================
router.patch("/next", async (req, res) => {
  try {
    if (db.store) {
      // 1. Complete any current patient in consultation
      const current = db.store.queue.find(
        (q) => q.status === "in_consultation" || q.status === "called"
      );
      if (current) {
        current.status = "completed";
        current.completed_at = new Date().toISOString();
        const apt = db.store.appointments.find((a) => a.id === current.appointment_id);
        if (apt) apt.status = "completed";
      }

      // 2. Select next patient: emergency -> priority -> normal
      const waitingList = db.store.queue.filter((q) => q.status === "waiting");
      if (waitingList.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No waiting patients in queue.",
        });
      }

      waitingList.sort((a, b) => {
        const pA = PRIORITY_ORDER[a.priority] || 4;
        const pB = PRIORITY_ORDER[b.priority] || 4;
        if (pA !== pB) return pA - pB;
        return a.id - b.id;
      });

      const nextItem = waitingList[0];
      nextItem.status = "in_consultation";
      nextItem.called_at = new Date().toISOString();
      nextItem.patients_ahead = 0;
      nextItem.estimated_wait_time = 0;

      const apt = db.store.appointments.find((a) => a.id === nextItem.appointment_id);
      const patient = apt ? db.store.patients.find((p) => p.id === apt.patient_id) : null;
      const doctor = apt ? db.store.doctors.find((d) => d.id === apt.doctor_id) : null;
      const dept = apt ? db.store.departments.find((d) => d.id === apt.department_id) : null;

      // Update remaining patients ahead counts
      let ahead = 0;
      db.store.queue
        .filter((q) => q.status === "waiting")
        .sort((a, b) => (PRIORITY_ORDER[a.priority] || 4) - (PRIORITY_ORDER[b.priority] || 4))
        .forEach((q) => {
          q.patients_ahead = ahead;
          q.estimated_wait_time = ahead * AVERAGE_CONSULTATION_TIME;
          ahead++;
        });

      // Persist to disk
      db.save();

      return res.json({
        success: true,
        message: `Token #${nextItem.token_number} called for consultation!`,
        queue: {
          id: nextItem.id,
          token_number: nextItem.token_number,
          priority: nextItem.priority,
          status: "in_consultation",
          patient_name: patient ? patient.name : "Patient",
          doctor_name: doctor ? doctor.name : "Doctor",
          department: dept ? dept.name : "General",
          room: doctor ? doctor.room : "101",
        },
      });
    }

    res.json({ success: true, message: "Next patient called." });
  } catch (error) {
    console.error("Next patient error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to call next patient.",
      error: error.message,
    });
  }
});

// ==================== COMPLETE APPOINTMENT ====================
router.patch("/:id/complete", async (req, res) => {
  try {
    const queueId = Number(req.params.id);
    if (db.store) {
      const item = db.store.queue.find((q) => q.id === queueId || q.token_number === req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Queue entry not found.",
        });
      }

      item.status = "completed";
      item.completed_at = new Date().toISOString();
      const apt = db.store.appointments.find((a) => a.id === item.appointment_id);
      if (apt) apt.status = "completed";

      db.save();

      return res.json({
        success: true,
        message: `Token #${item.token_number} marked as completed.`,
        queue: item,
      });
    }

    res.json({ success: true, message: "Marked completed." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to complete appointment.",
      error: error.message,
    });
  }
});

module.exports = router;
