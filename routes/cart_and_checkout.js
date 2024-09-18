const express = require('express');
const cartCheckoutController = require('../controller/cartCheckoutController');
const router = express.Router();
const upload_files = require('../middleware/upload');

router.post('/addToCart', cartCheckoutController.addToCart);


module.exports = router;