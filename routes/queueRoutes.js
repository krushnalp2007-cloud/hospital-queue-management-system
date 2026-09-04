const express = require("express");

const router = express.Router();

// Temporary in-memory queue
const queue = [];

// Average consultation time (minutes)
const AVERAGE_CONSULTATION_TIME = 10;

// Priority order
const PRIORITY_ORDER = {
    emergency: 1,
    priority: 2,
    normal: 3,
};

// ==================== BOOK APPOINTMENT ====================

router.post("/book", (req, res) => {
    try {
        const {
            patientName,
            department,
            doctor,
            priority = "normal",
        } = req.body;

        if (!patientName || !department || !doctor) {
            return res.status(400).json({
                message:
                    "Patient name, department and doctor are required",
            });
        }

        if (!["normal", "priority", "emergency"].includes(priority)) {
            return res.status(400).json({
                message:
                    "Priority must be normal, priority, or emergency",
            });
        }

        // Generate token
        const tokenNumber = queue.length + 1;

        // Count patients ahead based on priority
        const patientsAhead = queue.filter(
            (patient) =>
                patient.department === department &&
                patient.doctor === doctor &&
                patient.status === "waiting" &&
                PRIORITY_ORDER[patient.priority] <= PRIORITY_ORDER[priority]
        ).length;

        // Predict waiting time
        const estimatedWaitTime =
            patientsAhead * AVERAGE_CONSULTATION_TIME;

        const appointment = {
            id: Date.now().toString(),
            tokenNumber,
            patientName,
            department,
            doctor,
            priority,
            patientsAhead,
            estimatedWaitTime,
            status: "waiting",
            createdAt: new Date(),
        };

        queue.push(appointment);

        // Sort queue by priority
        queue.sort(
            (a, b) =>
                PRIORITY_ORDER[a.priority] -
                PRIORITY_ORDER[b.priority]
        );

        // Recalculate waiting times
        recalculateQueue();

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to book appointment",
            error: error.message,
        });
    }
});

// ==================== RECALCULATE QUEUE ====================

function recalculateQueue() {
    const waitingPatients = queue.filter(
        (patient) => patient.status === "waiting"
    );

    waitingPatients.forEach((patient, index) => {
        const patientsBefore = waitingPatients.filter(
            (other) =>
                other.department === patient.department &&
                other.doctor === patient.doctor &&
                other.id !== patient.id &&
                PRIORITY_ORDER[other.priority] <=
                    PRIORITY_ORDER[patient.priority]
        ).length;

        patient.patientsAhead = patientsBefore;
        patient.estimatedWaitTime =
            patientsBefore * AVERAGE_CONSULTATION_TIME;
    });
}

// ==================== VIEW QUEUE ====================

router.get("/", (req, res) => {
    res.json({
        totalPatients: queue.length,
        queue,
    });
});

// ==================== CURRENT PATIENT STATUS ====================

router.get("/:id", (req, res) => {
    const patient = queue.find(
        (item) => item.id === req.params.id
    );

    if (!patient) {
        return res.status(404).json({
            message: "Appointment not found",
        });
    }

    res.json({
        appointment: patient,
    });
});

// ==================== COMPLETE APPOINTMENT ====================

router.patch("/:id/complete", (req, res) => {
    const patient = queue.find(
        (item) => item.id === req.params.id
    );

    if (!patient) {
        return res.status(404).json({
            message: "Appointment not found",
        });
    }

    patient.status = "completed";

    // Recalculate remaining patients
    recalculateQueue();

    res.json({
        message: "Appointment completed",
        appointment: patient,
    });
});

// ==================== PATIENT ALERT ====================

router.get("/:id/alert", (req, res) => {
    const patient = queue.find(
        (item) => item.id === req.params.id
    );

    if (!patient) {
        return res.status(404).json({
            message: "Appointment not found",
        });
    }

    const alert =
        patient.estimatedWaitTime <= 15
            ? "Your appointment is coming up soon. Please be ready."
            : "Your appointment is not yet due.";

    res.json({
        patientName: patient.patientName,
        estimatedWaitTime: patient.estimatedWaitTime,
        alert,
    });
});
// ==================== HOSPITAL DASHBOARD SUMMARY ====================

router.get("/dashboard/summary", (req, res) => {
    const waitingPatients = queue.filter(
        (patient) => patient.status === "waiting"
    );

    const emergencyPatients = waitingPatients.filter(
        (patient) => patient.priority === "emergency"
    );

    const totalWaitTime = waitingPatients.reduce(
        (sum, patient) => sum + patient.estimatedWaitTime,
        0
    );

    const averageWaitingTime =
        waitingPatients.length > 0
            ? Math.round(totalWaitTime / waitingPatients.length)
            : 0;

    res.json({
        totalPatients: queue.length,
        waitingPatients: waitingPatients.length,
        emergencyPatients: emergencyPatients.length,
        completedPatients: queue.filter(
            (patient) => patient.status === "completed"
        ).length,
        averageWaitingTime,
    });
});
module.exports = router;