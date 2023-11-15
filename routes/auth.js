// routes/auth.js
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const passport = require('../auth/passport');

router.post('/login', passport.authenticate('local', {
successRedirect: '/dashboard',
failureRedirect: '/login',
failureFlash: true // Enables flash messages for failed login attempts
}));

// Logout route
router.get('/logout', (req, res) => {
req.logout();
res.redirect('/');
});

// Dashboard route (protected)
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
  });

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
if (req.isAuthenticated()) {
  return next();
}
res.redirect('/login');
}

module.exports = router;
