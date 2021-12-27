const express = require('express');
const Road = require('../models/userModel');
const userController = require('../controllers/userController');
const authorizationController = require('../controllers/authorizationController');

const router = express.Router();

router.post('/signup', authorizationController.signup);
router.post('/signin', authorizationController.signin);
router.post('/userForgotPassword', authorizationController.userForgotPassword);
router.patch(
  '/resetUserPassword/:token',
  authorizationController.resetUserPassword
);
router.get('/logout', authorizationController.logout);

// Protect all routes after this middleware
router.use(authorizationController.security);

router.patch(
  '/updateLoginUserPassword',
  authorizationController.updateLoginUserPassword
);
router.get('/me', userController.Ja, userController.getOneUser);
router.delete('/deleteOneUser', userController.deleteOneUser);

router.use(authorizationController.restrictions('admin'));

router.route('/').post(userController.createOneUser);

router
  .route('/:id')
  .get(userController.getOneUser)
  .patch(userController.updateOneUser)
  .delete(userController.deleteOneUser);

module.exports = router;
