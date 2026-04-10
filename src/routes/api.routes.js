const express = require("express");
const { getApiHealth } = require("../controllers/api.controller");

const router = express.Router();

router.get("/health", getApiHealth);

module.exports = router;
