const getHealthData = () => {
  return {
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  };
};

module.exports = {
  getHealthData,
};
