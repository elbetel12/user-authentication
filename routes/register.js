//Post Request that handles Register in route/register.js
const express = require('express');
const router = express.Router();
const { renderRegisterForm, registerUser } = require('../controllers/userController');

// Render the registration form
router.get('/', renderRegisterForm);

// Handle user registration
router.post('/', registerUser);

module.exports = router;




