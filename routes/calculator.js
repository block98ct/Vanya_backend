const express = require('express');
const calcController = require('../controller/calculatorController');
const chatGptController = require('../controller/chatGptController');
const projectsController = require('../controller/projectsController');
const router = express.Router();

router.post('/calculate', calcController.CalculateOffset);
router.post('/recipeCalculate', calcController.Calculateingredients);
router.post('/chatGpt', chatGptController.getTabularDataFromAPI);
router.post('/sectorSuggestion', projectsController.getSectorSuggestion);


module.exports = router;