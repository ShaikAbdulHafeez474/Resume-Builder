
// models/Template.js
const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g. "summary"
  label: { type: String, required: true }, // e.g. "Professional Summary"
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  html: { type: String, required: true }, // section HTML snippet
});

const pageSettingsSchema = new mongoose.Schema({
  size: { type: String, default: "A4" }, // A4, Letter, Legal, etc.
  orientation: { type: String, default: "portrait" }, // portrait | landscape
  margins: {
    top: { type: Number, default: 20 }, // in mm
    bottom: { type: Number, default: 20 },
    left: { type: Number, default: 20 },
    right: { type: Number, default: 20 },
  },
  font: { type: String, default: "Arial" }, // default font
  fontSize: { type: Number, default: 12 }, // default font size (pt)
});

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  previewURL: { type: String },
  styles: { type: String }, // CSS
  page: pageSettingsSchema, // 🆕 page-level settings
  sections: [sectionSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Template", templateSchema);
