var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('./common/logger');
var cors = require('cors');
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session)
const { ValidationError } = require('express-json-validator-middleware')

require('dotenv').config();

var { pool } = require('./utility/dbConn');
const { seq } = require('./utility/orm');

var usersRouter = require('./routes/users');
var campaignRouter = require('./routes/campaigns');

var app = express();

var sessionStore = new MySQLStore({}, pool);

app.use(session({
	key: 'sessionToken',
	secret: process.env.sessionSecret,
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './client/build')));
app.set('view engine', 'jade');

app.use('/api/users', usersRouter);
app.use('/api/campaign', campaignRouter);
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html")
  );
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((error, request, response, next) => {
  // Check the error is a validation error
  if (error instanceof ValidationError) {
    // Handle the error
    response.status(200);
    response.json({ message: 'Error', error: error.validationErrors });
  } else {
    // Pass error on if not a validation error
    next(error);
  }
});

//do something when app is closing
process.on('exit', async () => {
  try {
    await seq.closeConnection();
    await pool.closeConnection();
  } catch(e) {
    logger.error(e);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
})

module.exports = app;