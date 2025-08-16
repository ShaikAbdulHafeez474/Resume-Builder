
// services/renderer.js
const Handlebars = require("handlebars");

/**
 * Renders a template by merging resume JSON with HTML + CSS.
 * 
 * @param {string} html - The HTML template string (with Handlebars placeholders).
 * @param {string} css - The CSS string to style the template.
 * @param {object} resumeData - JSON data representing the resume.
 * @returns {string} Final HTML string.
 */
function renderTemplate(html, css, resumeData) {
  try {
    // Compile the template
    const template = Handlebars.compile(html);

    // Merge JSON data
    const content = template(resumeData);

    // Wrap with <style> so CSS applies
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>${css}</style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
  } catch (error) {
    throw new Error("Template rendering failed: " + error.message);
  }
}

module.exports = { renderTemplate };
