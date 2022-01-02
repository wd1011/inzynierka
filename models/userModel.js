const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Wprowadz hasło!'],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Potwierdz swoje haslo!'],
    validate: {
      validator: function (element) {
        return element === this.password;
      },
      message: 'Podales różne hasła. Hasła muszą być takie same!',
    },
  },

  timeWhenPasswordChanged: Date,
  passwdResetToken: String,
  passwdResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//hashowanie hasla
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.timeWhenPasswordChanged = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.timePasswordChanged = function (JWTTimestamp) {
  if (this.timeWhenPasswordChanged) {
    const changedTimestamp = parseInt(
      this.timeWhenPasswordChanged.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.resetToken = function () {
  const reseToken = crypto.randomBytes(32).toString('hex');

  this.passwdResetToken = crypto
    .createHash('sha256')
    .update(reseToken)
    .digest('hex');

  //console.log({ reseToken }, this.passwdResetToken);

  this.passwdResetExpires = Date.now() + 10 * 60 * 1000;

  return reseToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
