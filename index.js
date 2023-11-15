
const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
const passport = require("passport"); 
const MongoStore = require('connect-mongo'); // Use this if storing sessions in MongoDB
// Import Passport configuration
const  protectMiddleware  = require('./auth/protect'); 
const dotenv = require("dotenv");
dotenv.config();

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const authRoutes = require('./routes/auth');

// Use the MONGOLAB_URI environment variable for the database connection string
mongoose.connect(process.env.MONGODB_URI );
  
const db =mongoose.connection
db.on('error',error => console.error('MongoDB connection error:',error))
db.once('open', () => console.log('connected to Mongoose'))


//BoyParsing
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', __dirname + '/views'); // Specify the directory where your views are located


// Use connect-mongo to create a store
const mongoStore = MongoStore.create({
  mongoUrl: 'mongodb://localhost:27017/mylibrary',
  mongooseConnection: mongoose.connection,
  collection: 'sessions', // Optional: Specify the session collection name
});


// Use the session middleware with your generated secret key
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  }),

);

// Initialize Passport and restore authentication state if available from the session
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.get('/', (req, res) => {
  res.render('layout'); // Render the 'index.ejs' view
});

app.get('/login', (req, res) => {
    res.render('login'); // Pass 'error' as null when rendering the view
});

app.get('/logout', (req, res) => {
  res.render('logout'); // Pass 'error' as null when rendering the view
});

app.get('/register', (req, res) => {
    res.render('register'); // Pass 'error' as null when rendering the view
});


app.get('/dashboard', protectMiddleware.isLoggedIn, (req, res) => {
  res.render('dashboard', { user: req.user });
});

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/auth', authRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
}); 


const PORT = process.env.PORT || 4111;


app.listen(PORT, () => {
  console.log("Server has started on port: " + PORT);
});
