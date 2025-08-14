
// src/utils/ajvValidator.js
// Helper to validate request bodies against JSON Schema

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const schema = require('../validation/resume.schema.json');

const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

const validateResume = ajv.compile(schema);

module.exports = function (data) {
  const valid = validateResume(data);
  if (!valid) {
    const errors = validateResume.errors.map(err => ({
      field: err.instancePath || err.params.missingProperty,
      message: err.message
    }));
    return { valid: false, errors };
  }
  return { valid: true };
};
