
const { verifyAccess } = require('../config/jwt');

module.exports = function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = verifyAccess(token);
    if (payload.type !== 'access') return res.status(401).json({ message: 'Invalid token type' });
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid/expired token' });
  }
};



