
const express = require('express');
const router = express.Router();
const { authLimiter } = require('../config/rateLimiter');
const requireAuth = require('../middleware/requireAuth');
const passport = require('../config/passport');
const ctrl = require('../controllers/auth.controller');

// base (local) health
router.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth' }));

// email/password
router.post('/register', authLimiter, ctrl.register);
router.post('/login', authLimiter, ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

// protected example
router.get('/me', requireAuth, ctrl.me);

// Google OAuth (sessionless)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Use a custom callback to respond JSON instead of redirects (easy for Postman)
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }),
  async (req, res) => {
    const { signAccessToken, signRefreshToken } = require('../config/jwt');
    const { sha256 } = require('../config/crypto');

    const user = req.user;
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    user.refreshTokenHash = sha256(refreshToken);
    await user.save();

    // set cookie and return json; in a real app you might redirect to frontend
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      accessToken,
      user: { id: user._id, email: user.email, name: user.name },
      provider: 'google',
    });
  }
);

router.get('/google/failure', (req, res) => res.status(401).json({ message: 'Google authentication failed' }));

module.exports = router;
