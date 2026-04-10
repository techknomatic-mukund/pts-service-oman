const { getHealthData, scheduleConsultation } = require("../services/api.service");

const getApiHealth = (req, res, next) => {
  try {
    const data = getHealthData();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const scheduleConsultationRequest = async (req, res, next) => {
  try {
    const payload = req.body;
    const data = await scheduleConsultation(payload);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const scheduleConsultationEmailOnly = async (req, res, next) => {
  try {
    const payload = req.body;
    const data = await scheduleConsultation(payload);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApiHealth,
  scheduleConsultationRequest,
  scheduleConsultationEmailOnly,
};
