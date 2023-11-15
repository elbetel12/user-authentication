
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Users');
const bcrypt = require('bcrypt');

// Use the local strategy with Passport
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    //Check customer
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          console.log("wrong email");
          return done();
        }
        //Match Password
        bcrypt.compare(password, user.password, (error, isMatch) => {
          if (error) throw error;
          if (isMatch) {
            return done(null, user);
          } else {
            console.log("Wrong password");
            return done();
          }
        });
      })
      .catch((error) => console.log(error));
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;