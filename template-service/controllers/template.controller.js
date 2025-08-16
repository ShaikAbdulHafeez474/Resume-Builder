
// controllers/template.controller.js
const Template = require("../models/Template");

/**
 * Get all templates (metadata only)
 */
exports.getTemplates = async (req, res, next) => {
  try {
    const templates = await Template.find({}, "name previewURL pageSize sections");
    res.json(templates);
  } catch (err) {
    next(err);
  }
};

/**
 * Get single template by ID
 */
exports.getTemplateById = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json(template);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new template
 */
exports.createTemplate = async (req, res, next) => {
  try {
    const template = new Template(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a template
 */
exports.updateTemplate = async (req, res, next) => {
  try {
    const template = await Template.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json(template);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a template
 */
exports.deleteTemplate = async (req, res, next) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json({ message: "Template deleted successfully" });
  } catch (err) {
    next(err);
  }
};
