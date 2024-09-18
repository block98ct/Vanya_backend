const express = require('express');
const homeController = require('../controller/homeController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/homePage',auth, homeController.homePage);
router.post('/allArtist',auth, homeController.allArtist);
router.get('/termsAndcondition',auth, homeController.termsAndcondition);
router.get('/privacyPolicy',auth, homeController.privacyPolicy);

module.exports = router;