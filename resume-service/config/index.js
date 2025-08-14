// src/config/index.js
// Simple configuration loader for resume-service

require('dotenv').config(); // loads .env into process.env

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5003,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/resume-service',
};

module.exports = config;
