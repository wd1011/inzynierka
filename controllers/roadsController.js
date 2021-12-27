const Road = require('../models/roadModel');
const APIhandler = require('../utils/apiHandler');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandler');
const editModelHandler = require('../controllers/editModelHandler');

exports.getRoad = editModelHandler.getOne(Road);
exports.createRoad = editModelHandler.createOne(Road);
exports.deleteRoad = editModelHandler.deleteOne(Road);
exports.updateRoad = editModelHandler.updateOne(Road);

exports.getAllRoads = catchAsync(async (req, res, next) => {
  const features = new APIhandler(Road.find(), req.query).filter();
  const road = await features.query;

  Road.find({}, function (err, road) {
    res.render('wyszukiwarka.ejs', {
      roadList: road,
    });
  });
});
