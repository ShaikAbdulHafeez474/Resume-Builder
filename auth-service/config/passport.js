
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      // we run sessionless; no serializeUser needed
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const googleId = profile.id;
        const name = profile.displayName;

        let user = await User.findOne({ $or: [{ googleId }, { email }] });
        if (!user) {
          user = await User.create({ email, googleId, name });
        } else if (!user.googleId) {
          user.googleId = googleId; // link existing email to Google account
          await user.save();
        }
        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  )
);

module.exports = passport;
