const express = require('express');
const router = express.Router();
const { renderLoginForm,} = require('../controllers/userController');

// Render the login form
router.get('/', renderLoginForm);


module.exports = router;






