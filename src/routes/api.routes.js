const express = require("express");
const {
  getApiHealth,
  scheduleConsultationRequest,
  scheduleConsultationEmailOnly,
} = require("../controllers/api.controller");
const {
  scheduleConsultationRateLimiter,
} = require("../middlewares/schedule-consultation-rate-limit.middleware");

const router = express.Router();

router.get("/health", getApiHealth);
router.post(
  "/schedule-consultation",
  scheduleConsultationRateLimiter,
  scheduleConsultationRequest
);
router.post(
  "/schedule-consultation-email",
  scheduleConsultationRateLimiter,
  scheduleConsultationEmailOnly
);

module.exports = router;
