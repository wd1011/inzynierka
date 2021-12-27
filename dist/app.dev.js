'use strict';

var path = require('path');

var express = require('express');

var morgan = require('morgan');

var helmet = require('helmet');

var _require = require('nodemon'),
  restart = _require.restart;

var ejs = require('ejs');

var bodyParser = require('body-parser');

var cors = require('cors');

var AppError = require('./utils/appError');

var route = require('./routes/route');

var userRoad = require('./routes/userRoad');

var app = express(); //const scraper = require('./scraper');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cors());
app.options('*', cors());
app.use(express['static'](path.join(__dirname, 'public')));
app.use(helmet()); //middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(bodyParser.json());
app.use('/remonty', route);
app.use('/remonty/users', userRoad);
app.all('*', function (req, res, next) {
  next(
    new AppError("Can't find ".concat(req.originalUrl, ' on this server!'), 404)
  );
});
module.exports = app;
