// src/models/Resume.js
// Resume schema with version history support

const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema(
  {
    data: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    currentVersion: { type: Object, required: true },
    versions: { type: [versionSchema], default: [] },
  },
  { timestamps: true }
);

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume; // ✅ CommonJS export
