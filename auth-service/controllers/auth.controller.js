
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { signAccessToken, signRefreshToken, verifyRefresh } = require('../config/jwt');
const { sha256 } = require('../config/crypto');

const setRefreshCookie = (res, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, // align with REFRESH_TOKEN_TTL
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name });

    // issue tokens
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    user.refreshTokenHash = sha256(refreshToken);
    await user.save();

    setRefreshCookie(res, refreshToken);
    return res.status(201).json({ accessToken, user: { id: user._id, email: user.email, name: user.name } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    user.refreshTokenHash = sha256(refreshToken); // rotate
    await user.save();

    setRefreshCookie(res, refreshToken);
    return res.json({ accessToken, user: { id: user._id, email: user.email, name: user.name } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.refresh = async (req, res) => {
  try {
    // read from cookie first, fallback to body (useful for Postman)
    const incoming = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incoming) return res.status(401).json({ message: 'No refresh token' });

    let payload;
    try {
      payload = verifyRefresh(incoming);
    } catch (_) {
      return res.status(401).json({ message: 'Invalid/expired refresh token' });
    }
    if (payload.type !== 'refresh') return res.status(401).json({ message: 'Invalid token type' });

    const user = await User.findById(payload.sub);
    if (!user || !user.refreshTokenHash) return res.status(401).json({ message: 'Not authorized' });

    // rotation check: token must match the currently stored hash
    if (user.refreshTokenHash !== sha256(incoming)) {
      // optional: revoke and force re-login
      user.refreshTokenHash = null;
      await user.save();
      return res.status(401).json({ message: 'Refresh token mismatch (rotated/compromised). Please login again.' });
    }

    // rotate: issue new pair and store new refresh hash
    const accessToken = signAccessToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);
    user.refreshTokenHash = sha256(newRefreshToken);
    await user.save();

    setRefreshCookie(res, newRefreshToken);
    return res.json({ accessToken, user: { id: user._id, email: user.email, name: user.name } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    // best-effort: clear stored refresh
    const incoming = req.cookies?.refreshToken || req.body?.refreshToken;
    if (incoming) {
      try {
        const payload = verifyRefresh(incoming);
        const user = await User.findById(payload.sub);
        if (user) {
          user.refreshTokenHash = null;
          await user.save();
        }
      } catch (_) {}
    }
    res.clearCookie('refreshToken', { path: '/auth' });
    return res.json({ message: 'Logged out' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.userId).select('_id email name googleId');
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ user });
};
