const express = require('express');
const projectContractController = require('../controller/projectContract.controtllers');
const router = express.Router();
const upload = require("../utils/multer.js");


router.get('/owner/:addr',  projectContractController.getOwnerAddressHandle);
router.get('/symbol',  projectContractController.getSymbolHandle);
//router.get('/details',  projectContractController.getProjectDataHandle);
router.get('/carbon-ndvi',  projectContractController.getCarbonAndNdviData);
router.post('/addProjectData',  projectContractController.addProjectDataHandle);
router.post('/updateProject',  projectContractController.updateProjectDataHandle);
router.post('/nft',  projectContractController.issueCertificate);
router.post('/transferNft',  projectContractController.transferNftHandle);
router.post('/getAllTimestamps',  projectContractController.getAllTimestampsOfProjectHandle);
router.post('/getProjectByTimestamp',  projectContractController.getProjectByTimestampHandle);
router.get('/projectCreatedTime',  projectContractController.projectCreatedTimeHandle);


module.exports = router;