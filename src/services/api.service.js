const { sendScheduleConsultationMail } = require("./graph-email.service");

const getHealthData = () => {
  return {
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  };
};

const scheduleConsultation = async (payload) => {
  console.log("Schedule Consultation payload:", payload);
  const emailStatus = await sendScheduleConsultationMail(payload);

  return {
    success: true,
    message: "Schedule Consultation request received",
    emailStatus,
    timestamp: new Date().toISOString(),
  };
};

module.exports = {
  getHealthData,
  scheduleConsultation,
};
