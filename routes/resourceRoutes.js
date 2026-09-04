const express = require("express");

const router = express.Router();

// Temporary hospital resource data
const resources = {
    generalBeds: {
        total: 50,
        occupied: 32,
        available: 18,
    },

    icuBeds: {
        total: 10,
        occupied: 7,
        available: 3,
    },

    emergencyRooms: {
        total: 5,
        occupied: 3,
        available: 2,
    },

    ventilators: {
        total: 8,
        occupied: 5,
        available: 3,
    },
};

// ==================== GET RESOURCE AVAILABILITY ====================

router.get("/", (req, res) => {
    res.json({
        resources,
    });
});

module.exports = router;