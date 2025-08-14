
// src/app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const resumeRoutes = require('./routes/resume.routes');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes (secured)
app.use('/', authMiddleware, resumeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'resume-service' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;
