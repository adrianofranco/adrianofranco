var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var asciiArt = require('./routes/asciiArt');

var app = express();

const rootPath = path.join(__dirname);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use("/", express.static(path.join(__dirname, 'public')));

app.use('/ascii-art', asciiArt);

app.use('/', indexRouter);
app.use('/index.html', indexRouter);




module.exports = app;