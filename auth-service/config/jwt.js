
const jwt = require('jsonwebtoken');
require('dotenv').config();
const signAccessToken = (userId) =>
  jwt.sign({ sub: String(userId), type: 'access' }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL || '15m',
  });

/**
 * We’ll keep refresh tokens as JWTs too (with a different secret).
 * We also store a HASH of the exact refresh token server-side for rotation.
 */
const signRefreshToken = (userId) =>
  jwt.sign({ sub: String(userId), type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_TTL || '7d',
  });

const verifyAccess = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const verifyRefresh = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccess,
  verifyRefresh,
};
