require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// auth related imports
const session = require('express-session');
const mongoose = require('mongoose');
const mongodbStore = require('connect-mongo')(session);

const router = require('./router/routes');
const staticPath = path.join(__dirname, '../public');

// pug rendering
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../templates'));

// serve static files
app.use(express.static(staticPath));

// Accept json as well as form data
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Connect to mongodb
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
    // ,
    // useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

//session
app.use(
  session({
    name: 'quicklinks.sess',
    store: new mongodbStore({
      mongooseConnection: mongoose.connection,
      touchAfter: 24 * 3600
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 15 }
  })
);

// Register the routes
app.use('/', router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
