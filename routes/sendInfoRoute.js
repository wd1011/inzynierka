const express = require('express');
const sendInfoController = require('../controllers/sendInfoController');
const authorizationController = require('../controllers/authorizationController');
const router = express.Router();

router
    .post(
        '/wyslijWiadomosc',
        authorizationController.security,
        sendInfoController.sendEmail
    );
router
    .post(
        '/wyslij-Wojewodztwo',
        authorizationController.security,
        sendInfoController.saveWoj
    );
router
    .post(
        '/wyslij-Numer-Drogi',
        authorizationController.security,
        sendInfoController.saveNumberOfRoad
    );
router
    .post(
        '/wyslij-Nazwe-Odcinka',
        authorizationController.security,
        sendInfoController.saveRoute
    );
module.exports = router;