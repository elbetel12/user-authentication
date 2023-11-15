const passport = require('../auth/passport');
const User = require('../models/Users');
const bcrypt = require('bcrypt');


// Render the registration form
const renderRegisterForm = (req, res) => {
  res.render('register.ejs');
};

// Render the login form
const renderLoginForm = (req, res) => {
  res.render('login.ejs');
};

// Handle user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Add additional validation logic as needed
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Handle user login using Passport
const loginUser = async (req, res, next) => {
  try {
    const result = await passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      // Remove the failureFlash option
    })(req, res, next);

    // Handle custom logic after authentication if needed
    // ...

    return result; // Ensure the result is returned
  } catch (err) {
    if (err.message === 'Incorrect email.') {
      console.log("Wrong email"); // Log the message
      return res.status(400).json({ error: 'Wrong email' });
    }

    if (err.message === 'Incorrect password.') {
      console.log("Wrong password"); // Log the message
      return res.status(401).json({ error: 'Wrong password' });
    }

    // Handle other errors or pass the error message directly to the view
    res.render('login', { error: err.message });
  }
};
module.exports = { renderRegisterForm, registerUser, renderLoginForm, loginUser };


