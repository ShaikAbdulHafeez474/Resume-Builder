
// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const templateRoutes = require("./routes/template.routes");
const errorHandler = require("./utils/errorHandler");

const app = express();

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(morgan("dev"));  // logging

// Routes
app.use("/api/templates", templateRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "template-service" });
});

// Central error handler
app.use(errorHandler);

module.exports = app;
