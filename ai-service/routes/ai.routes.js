
const express = require("express");
const router = express.Router();
const { improveSummary, generateSkills } = require("../controllers/ai.controller");

router.post("/improve-summary", improveSummary);
router.post("/generate-skills", generateSkills);

module.exports = router;
