const express = require('express');
const sendInfoController = require('../controllers/sendInfoController');
const authorizationController = require('../controllers/authorizationController');
const router = express.Router();
const pageController = require('../controllers/pageController');
router
    .post(
        '/wysylanieWiadomosci',
        authorizationController.security,
        sendInfoController.sendEmail
    );
router
    .post(
        '/wysylanie-Wojewodztwo',
        authorizationController.security,
        sendInfoController.saveWoj
    );
router
    .post(
        '/wysylanie-Numer-Drogi',
        authorizationController.security,
        sendInfoController.saveNumberOfRoad
    );
router
    .post(
        '/wysylanie-Nazw-Odcinka',
        authorizationController.security,
        sendInfoController.saveRoute
    );
module.exports = router;