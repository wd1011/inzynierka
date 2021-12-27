'use strict';

var mongoose = require('mongoose');

var validator = require('validator');

var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Wprowadz swoje imie'],
  },
  email: {
    type: String,
    required: [true, 'Wprowadz swoj adres email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Potwierdz adres email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Wprowadz hasło!'],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Potwierdz swoje haslo!'],
    validate: {
      validator: function validator(element) {
        return element === this.password;
      },
      message: 'Podales różne hasła. Hasła muszą być takie same!',
    },
  },
  passwdChanged: Date,
}); //hashowanie hasla

userSchema.pre('save', function _callee(next) {
  return regeneratorRuntime.async(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            if (this.isModified('password')) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', next());

          case 2:
            _context.next = 4;
            return regeneratorRuntime.awrap(bcrypt.hash(this.password, 12));

          case 4:
            this.password = _context.sent;
            this.confirmPassword = undefined;
            next();

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    this
  );
});
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({
    active: {
      $ne: false,
    },
  });
  next();
});

userSchema.methods.correctPassword = function _callee2(
  candidatePassword,
  userPassword
) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch ((_context2.prev = _context2.next)) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(
            bcrypt.compare(candidatePassword, userPassword)
          );

        case 2:
          return _context2.abrupt('return', _context2.sent);

        case 3:
        case 'end':
          return _context2.stop();
      }
    }
  });
};

userSchema.methods.changedPwd = function (JWTTimestamp) {
  if (this.passwdChanged) {
    var changedTimestamp = parseInt(this.passwdChanged.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

var User = mongoose.model('User', userSchema);
module.exports = User;
