const express = require('express');
const roadsController = require('../controllers/roadsController');
const authorizationController = require('../controllers/authorizationController');
const User = require('../controllers/userController');

const router = express.Router();
router.route('/wyszukiwarka').get(roadsController.getAllRoads);
router
    .route('/:id')
    .get(roadsController.getRoad)
    .patch(
        authorizationController.security,
        authorizationController.restrictions('admin'),
        roadsController.updateRoad
    )
    .delete(
        authorizationController.security,
        authorizationController.restrictions('admin'),
        roadsController.deleteRoad
    );
router
    .route('/')
    .post(
        authorizationController.security,
        authorizationController.restrictions('admin'),
        roadsController.createRoad
    );

module.exports = router;