
// routes/template.routes.js
const express = require("express");
const router = express.Router();
const templateController = require("../controllers/template.controller");
const auth = require("../middleware/auth"); // optional if templates require auth
const validate = require("../middleware/validate"); // we’ll wire Ajv later

// Public: get all templates
router.get("/", templateController.getTemplates);

// Public: get a specific template
router.get("/:id", templateController.getTemplateById);

// Protected: create template
router.post("/", auth, templateController.createTemplate);

// Protected: update template
router.put("/:id", auth, templateController.updateTemplate);

// Protected: delete template
router.delete("/:id", auth, templateController.deleteTemplate);

module.exports = router;
