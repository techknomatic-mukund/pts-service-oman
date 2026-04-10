const express = require("express");
const {
  getApiHealth,
  scheduleConsultationRequest,
  scheduleConsultationEmailOnly,
} = require("../controllers/api.controller");

const router = express.Router();

router.get("/health", getApiHealth);
router.post("/schedule-consultation", scheduleConsultationRequest);
router.post("/schedule-consultation-email", scheduleConsultationEmailOnly);

module.exports = router;
