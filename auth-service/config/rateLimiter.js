
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter };
