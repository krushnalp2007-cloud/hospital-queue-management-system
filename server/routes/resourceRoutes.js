const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ==================== GET HOSPITAL RESOURCES ====================
router.get("/", (req, res) => {
  const defaultResources = {
    generalBeds: { total: 50, occupied: 32, available: 18 },
    icuBeds: { total: 10, occupied: 7, available: 3 },
    emergencyRooms: { total: 5, occupied: 3, available: 2 },
    ventilators: { total: 8, occupied: 5, available: 3 },
  };

  res.json({
    success: true,
    resources: defaultResources,
    list: db.store ? db.store.resources : [],
  });
});

module.exports = router;
