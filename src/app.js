const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const apiRoutes = require("./routes/api.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

if (config.trustProxy) {
  app.set("trust proxy", 1);
}

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(express.json());
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("PTS Oman API is running");
});

app.use(errorMiddleware);

module.exports = app;
