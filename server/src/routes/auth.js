const express = require('express');
const passport = require('../passport');
const prisma = require('../database');

module.exports = function (app) {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * @route GET /api/auth/google
   * @desc Initiate Google OAuth login
   * @access Public
   */
  app.get(
    '/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  /**
   * @route GET /api/auth/google/callback
   * @desc Google OAuth callback
   * @access Public
   */
  app.get(
    '/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // Set user in session
      req.session.user = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
      };

      // Update last login
      prisma.user.update({
        where: { id: req.user.id },
        data: {
          lastLogin: new Date(),
        },
      }).catch(err => console.error('Error updating last login:', err));

      // Redirect to frontend
      res.redirect(process.env.FRONTEND_URL + '/dashboard');
    }
  );

  return app;
};