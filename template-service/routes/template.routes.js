const express = require("express");
const router = express.Router();
const templateController = require("../controllers/template.controller");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

// Public: list all templates
router.get("/", templateController.getTemplates);

// Public: get a specific template
router.get("/:id", templateController.getTemplateById);

// ✅ Render resume using a template
router.post("/render", templateController.renderResume);

// Protected: create template
router.post("/", auth, templateController.createTemplate);

// Protected: update template
router.put("/:id", auth, templateController.updateTemplate);

// Protected: delete template
router.delete("/:id", auth, templateController.deleteTemplate);

module.exports = router;
