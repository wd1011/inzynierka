'use strict';

var jwt = require('jsonwebtoken');

var crypto = require('crypto');

var User = require('./../models/userModel');

var catchAsync = require('../utils/catchAsync');

var AppError = require('../utils/appError');

var token = function token(id) {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    }
  );
};

var createToken = function createToken(user, statusCode, res) {
  var tok = token(user._id);
  var cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', tok, cookieOptions); // Remove password from output

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(function _callee(req, res, next) {
  var newUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch ((_context.prev = _context.next)) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              confirmPassword: req.body.confirmPassword,
            })
          );

        case 2:
          newUser = _context.sent;
          res.status(201).json({
            status: 'success',
            data: {
              user: newUser,
            },
          });
          createToken(newUser, 201, res);

        case 5:
        case 'end':
          return _context.stop();
      }
    }
  });
});
exports.login = catchAsync(function _callee2(req, res, next) {
  var _req$body, email, password, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch ((_context2.prev = _context2.next)) {
        case 0:
          (_req$body = req.body),
            (email = _req$body.email),
            (password = _req$body.password);

          if (!(!email || !password)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt(
            'return',
            next(new AppError('Potwierdz adres email i haslo!', 400))
          );

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(
            User.findOne({
              email: email,
            }).select('+password')
          );

        case 5:
          user = _context2.sent;
          _context2.t0 = !user;

          if (_context2.t0) {
            _context2.next = 11;
            break;
          }

          _context2.next = 10;
          return regeneratorRuntime.awrap(
            user.correctPassword(password, user.password)
          );

        case 10:
          _context2.t0 = !_context2.sent;

        case 11:
          if (!_context2.t0) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt(
            'return',
            next(new AppError('Niepoprawny adres  email lub haslo', 401))
          );

        case 13:
          createToken(user, 200, res);

        case 14:
        case 'end':
          return _context2.stop();
      }
    }
  });
});
exports.protect = catchAsync(function _callee3(req, res, next) {
  var token, decoded, current;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch ((_context3.prev = _context3.next)) {
        case 0:
          // 1) Getting token and check of it's there
          if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
          ) {
            token = req.headers.authorization.split(' ')[1];
          }

          if (token) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt(
            'return',
            next(
              new AppError(
                'Nie jestes zalogowany, zaloguj sie aby miec dostęp.',
                401
              )
            )
          );

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(
            promisify(jwt.verify)(token, process.env.JWT_SECRET)
          );

        case 5:
          decoded = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 8:
          current = _context3.sent;

          if (current) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt(
            'return',
            next(new AppError('Ten uzytkownik juz nie istnieje.', 401))
          );

        case 11:
          if (!current.changedPasswordAfter(decoded.iat)) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt(
            'return',
            next(
              new AppError('Zmieniles swoje haslo, zaloguj sie ponownie.', 401)
            )
          );

        case 13:
          req.user = current;
          next();

        case 15:
        case 'end':
          return _context3.stop();
      }
    }
  });
});
