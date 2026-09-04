const express = require("express");

const router = express.Router();

// Temporary doctor data
const doctors = [
    {
        id: "D001",
        name: "Dr. Smith",
        department: "Cardiology",
        status: "available",
        nextAvailable: "Today",
    },
    {
        id: "D002",
        name: "Dr. Patel",
        department: "Neurology",
        status: "available",
        nextAvailable: "Today",
    },
    {
        id: "D003",
        name: "Dr. Kumar",
        department: "Orthopedics",
        status: "unavailable",
        nextAvailable: "Tomorrow",
    },
];

// ==================== GET ALL DOCTORS ====================

router.get("/", (req, res) => {
    res.json({
        doctors,
    });
});

// ==================== GET DOCTOR BY ID ====================

router.get("/:id", (req, res) => {
    const doctor = doctors.find(
        (item) => item.id === req.params.id
    );

    if (!doctor) {
        return res.status(404).json({
            message: "Doctor not found",
        });
    }

    res.json({
        doctor,
    });
});

// ==================== UPDATE DOCTOR STATUS ====================

router.patch("/:id/status", (req, res) => {
    const doctor = doctors.find(
        (item) => item.id === req.params.id
    );

    if (!doctor) {
        return res.status(404).json({
            message: "Doctor not found",
        });
    }

    const { status } = req.body;

    if (!["available", "unavailable"].includes(status)) {
        return res.status(400).json({
            message:
                "Status must be available or unavailable",
        });
    }

    doctor.status = status;

    if (status === "available") {
        doctor.nextAvailable = "Today";
    } else {
        doctor.nextAvailable = "Tomorrow";
    }

    res.json({
        message: "Doctor status updated",
        doctor,
    });
});
// ==================== CHECK APPOINTMENT AVAILABILITY ====================

router.get("/:id/appointment-option", (req, res) => {
    const doctor = doctors.find(
        (item) => item.id === req.params.id
    );

    if (!doctor) {
        return res.status(404).json({
            message: "Doctor not found",
        });
    }

    if (doctor.status === "available") {
        return res.json({
            doctor: doctor.name,
            available: true,
            message: "Doctor is available. Appointment can be booked today.",
        });
    }

    res.json({
        doctor: doctor.name,
        available: false,
        nextAvailable: doctor.nextAvailable,
        message: `Doctor is unavailable. Next appointment is available ${doctor.nextAvailable.toLowerCase()}.`,
    });
});
module.exports = router;