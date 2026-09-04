const express = require("express");

const router = express.Router();

// Temporary hospital resource data
const resources = {
    generalBeds: 18,
    icuBeds: 3,
    emergencyRooms: 2,
    ventilators: 3,
};

// Temporary in-memory emergency alerts
const emergencies = [];

// ==================== CREATE EMERGENCY ALERT ====================

router.post("/alert", (req, res) => {
    try {
        const {
            patientName,
            department,
            ambulanceEta,
            icuRequired = false,
            bedRequired = false,
        } = req.body;

        if (!patientName || !department || ambulanceEta === undefined) {
            return res.status(400).json({
                message:
                    "Patient name, department and ambulance ETA are required",
            });
        }

        // Check hospital resource availability
        const resourceStatus = {
            icuAvailable: icuRequired
                ? resources.icuBeds > 0
                : true,

            bedAvailable: bedRequired
                ? resources.generalBeds > 0
                : true,
        };

        const resourcesAvailable =
            resourceStatus.icuAvailable &&
            resourceStatus.bedAvailable;

        // Create emergency record
        const emergency = {
            id: Date.now().toString(),
            patientName,
            department,
            ambulanceEta,
            icuRequired,
            bedRequired,
            priority: "emergency",
            status: "incoming",

            resourcesAvailable,
            resourceStatus,

            createdAt: new Date(),
        };

        emergencies.push(emergency);

        res.status(201).json({
            message: "Emergency alert sent to hospital",
            emergency,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create emergency alert",
            error: error.message,
        });
    }
});

// ==================== VIEW EMERGENCIES ====================

router.get("/", (req, res) => {
    res.json({
        totalEmergencies: emergencies.length,
        emergencies,
    });
});

// ==================== UPDATE EMERGENCY STATUS ====================

router.patch("/:id/status", (req, res) => {
    const emergency = emergencies.find(
        (item) => item.id === req.params.id
    );

    if (!emergency) {
        return res.status(404).json({
            message: "Emergency alert not found",
        });
    }

    const { status } = req.body;

    const validStatuses = [
        "incoming",
        "arrived",
        "admitted",
        "completed",
    ];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid emergency status",
        });
    }

    emergency.status = status;

    res.json({
        message: "Emergency status updated",
        emergency,
    });
});

module.exports = router;