const express = require('express');
const projectContractController = require('../controller/project.controllers.js');
const router = express.Router();

const upload = require("../utils/multer.js");



router.post('/nftsByAddress', projectContractController.getNftsByAddressHandle);
router.post('/nftByAddressAndId', projectContractController.getNftByAddressAndIdHandle);



module.exports = router;



