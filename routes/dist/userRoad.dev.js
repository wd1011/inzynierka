'use strict';

var express = require('express');

var Road = require('../models/userModel');

var userController = require('../controllers/userController');

var authorizationController = require('../controllers/authorizationController');

var router = express.Router();
router.post('/signup', authorizationController.signup);
router.post('/login', authorizationController.login);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  ['delete'](userController.deleteUser);
module.exports = router;
