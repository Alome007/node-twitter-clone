const cookieParser = require('cookie-parser');
const express = require('express');
const httpErrors = require('http-errors');
const logger = require('morgan');
const path = require('path');
require("dotenv").config()

const key = require(process.env.FIREBASE_CREDENTIALS_FILE)
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(key),
  databaseURL: "https://node-twitter-clone.firebaseio.com"
});


const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const tweetRouter = require("./routes/tweetRouter");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/tweet', tweetRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpErrors(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
