const catchAsync = require('./../utils/catchAsync');
const ErrorHandler = require('./../utils/errorHandler');
const APIhandler = require('./../utils/apiHandler');
const User = require('../models/userModel');
const editModelHandler = require('../controllers/editModelHandler');

exports.getOneUser = editModelHandler.getOne(User);
exports.updateOneUser = editModelHandler.updateOne(User);
exports.deleteOneUser = editModelHandler.deleteOne(User);

exports.createOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Zaloguj się aby móc zobaczyć tą stronę  ',
  });
};
exports.Ja = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
