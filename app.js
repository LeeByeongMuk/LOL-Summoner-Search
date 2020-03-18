const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const crypto = require('crypto');

const dbConfig = require('./config.js');
const connection = mysql.createConnection(dbConfig.SQL);
const secret = dbConfig.KEY.secret;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var slidesRouter = require('./routes/slides');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Connect
connection.connect(function (err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

app.use('/', indexRouter);
app.use('/api/users', cors(), usersRouter);
app.use('/api/slides', slidesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
