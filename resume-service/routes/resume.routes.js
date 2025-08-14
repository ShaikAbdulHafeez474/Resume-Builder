
// src/routes/resume.routes.js
// Routes for resume CRUD and version management

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createResume,
  updateResume,
  getResume,
  restoreVersion
} = require('../controllers/resume.controller');

// Create a new resume
router.post('/', auth, createResume);

// Update an existing resume (creates new version)
router.put('/', auth, updateResume);

// Get current user's resume
router.get('/', auth, getResume);

// Restore a previous version by index
router.post('/restore/:versionIndex', auth, restoreVersion);

module.exports = router;
