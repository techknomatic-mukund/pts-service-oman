const rateLimit = require("express-rate-limit");
const config = require("../config/config");

const scheduleConsultationRateLimiter = rateLimit({
  windowMs: config.scheduleConsultationRateLimitWindowMs,
  limit: config.scheduleConsultationRateLimitMax,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many schedule consultation requests from this address. Please try again later.",
  },
  statusCode: 429,
});

module.exports = { scheduleConsultationRateLimiter };
