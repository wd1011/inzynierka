const express = require('express');
const pageController = require('../controllers/pageController');
const authorizationController = require('../controllers/authorizationController');
const router = express.Router();

router.get('/', authorizationController.isLoggedIn, pageController.mainPag);
router.get(
  '/mapaPolski',
  authorizationController.security,
  pageController.polishMap
);
router.get(
  '/signin',
  authorizationController.isLoggedIn,
  pageController.getLoginForm
);
router.get('/rejestracja', pageController.signUp);
router.get(
  '/mojeKonto',
  authorizationController.security,
  pageController.getAccount
);
router.get(
  '/kontakt',
  authorizationController.security,
  pageController.contactForm
);
router.get(
  '/przesłanie-wiadomosci',
  authorizationController.security,
  pageController.contactFormInformations
);
router.post('/send', authorizationController.security, pageController.send);
//router.get('/mapaPolski', pageController.polishMap);

router.get(
  '/NowyRemont',
  authorizationController.security,
  pageController.newRoad
);
router.get(
  '/scrapowanie',
  authorizationController.security,
  pageController.scrapowanie
);
router.get(
  '/listaUzytkownikow',
  authorizationController.security,
  pageController.getAllUsers
);
router.post(
  '/remonty/scrapowanie',
  authorizationController.security,
  pageController.scrap
);
router.get(
  '/remontyWojewodztwie',
  authorizationController.security,
  pageController.voivodeship
);
router.get(
  '/remontyNumerDrogi',
  authorizationController.security,
  pageController.numberOfRoad
);
router.get(
  '/remontyOdcinek',
  authorizationController.security,
  pageController.town
);
router.get(
  '/zmianaHasla',
  authorizationController.security,
  pageController.changePasswd
);
router.get('/glowna', pageController.mainPag);
module.exports = router;
