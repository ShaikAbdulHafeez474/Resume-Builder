
// src/middleware/auth.js
// JWT access token authentication for resume-service

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Ensure this is indeed an access token
    if (decoded.type !== 'access') {
      return res.status(401).json({ message: 'Invalid token type' });
    }

    req.user = { id: decoded.sub }; // userId from auth-service
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
