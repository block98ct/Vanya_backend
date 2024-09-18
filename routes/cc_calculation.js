const express = require('express');

const calcController = require('../controller/cCCalculationController');
const router = express.Router();

router.post('/calculateCarbonCredits', calcController.calculateCarbonCredits);

module.exports = router;