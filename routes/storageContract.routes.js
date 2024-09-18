const express = require('express');
const storageContractController = require('../controller/storageContract.Controllers.js');
const router = express.Router();

const upload = require("../utils/multer.js");



router.get('/owner', storageContractController.getOwnerHandle);
router.post('/check-contract', storageContractController.isContractCreatedHandle);
router.post('/uploadMetadata', storageContractController.uploadMetaDataHandle);
router.post('/uploadImage',upload.single("image"),  storageContractController.uploadImageHandle);
router.post('/createProject', storageContractController.createProjectHandle);

module.exports = router;