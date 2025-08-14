
// src/controllers/resume.controller.js
// Handles creating, updating, retrieving, and restoring resumes

const Resume = require('../models/Resume');

/**
 * Create a new resume
 */
const createResume = async (req, res) => {
  try {
    const { currentVersion } = req.body;

    if (!currentVersion) {
      return res.status(400).json({ message: 'currentVersion is required' });
    }

    const resume = new Resume({
      userId: req.user.id, // from auth middleware
      currentVersion,
      versions: [{ data: currentVersion }]
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update an existing resume (creates a new version)
 */
const updateResume = async (req, res) => {
  try {
    const { currentVersion } = req.body;
    const resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Add old version to versions array
    resume.versions.push({ data: resume.currentVersion });

    // Update current version
    resume.currentVersion = currentVersion;
    await resume.save();

    res.json(resume);
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get the current user's resume
 */
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Restore a resume to a previous version
 */
const restoreVersion = async (req, res) => {
  try {
    const { versionIndex } = req.params;
    const resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (versionIndex < 0 || versionIndex >= resume.versions.length) {
      return res.status(400).json({ message: 'Invalid version index' });
    }

    resume.currentVersion = resume.versions[versionIndex].data;
    await resume.save();

    res.json(resume);
  } catch (error) {
    console.error('Error restoring version:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createResume,
  updateResume,
  getResume,
  restoreVersion
};
