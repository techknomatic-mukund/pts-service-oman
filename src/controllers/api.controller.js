const { getHealthData } = require("../services/api.service");

const getApiHealth = (req, res, next) => {
  try {
    const data = getHealthData();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApiHealth,
};
