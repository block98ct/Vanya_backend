const express = require('express');
const projectsController = require('../controller/projectsController');
const router = express.Router();
const upload_files = require('../middleware/upload')

router.post('/geoJson', projectsController.getGeoJson);
router.get('/getProjectsByLimit',projectsController.getProjectsByPagination);
router.get('/getProjectsByLimitUser',projectsController.getProjectsByPaginationUser);
router.get('/getProjectsById',projectsController.getProjectsById);
router.post('/questionAnswer',projectsController.postAnswers);
router.post('/insertProject', projectsController.insertProject);
router.post('/editProject', projectsController.editProject); 
router.post('/addProjectMedias',upload_files.fields([{name : "video"},{ name:"image_1" }, { name: "image_2" }, { name: "image_3" }, { name:"image_4" }, { name: "image_5" }, { name: "image_6" },{ name: "geoJson" }]), projectsController.addProjectMedias);
router.post('/approveProject',projectsController.approveProject);  
router.post('/deleteProjectById',projectsController.deleteProjectById);
router.post('/createBuyTransaction', projectsController.createBuyTransaction);
router.get('/transactionHistoryUser', projectsController.transactionHistoryUser);
router.get('/getProjectsByIdSuperAdmin',projectsController.getProjectsByIdSuperAdmin);   
router.post('/updateProjectStatus',projectsController.updateProjectStatus);
router.post('/getProjectMedia',projectsController.getProjectMedia);
router.post('/getProjectDocument',projectsController.getProjectDocument);    
router.post('/editProjectMedias',upload_files.fields([{name : "video"},{ name:"image_1" }, { name: "image_2" }, { name: "image_3" }, { name:"image_4" }, { name: "image_5" }, { name: "image_6" }, { name: "geoJson" }]),projectsController.editProjectMedias);
router.post('/addProjectMedias',upload_files.fields([{name : "video"},{ name:"image_1" }, { name: "image_2" }, { name: "image_3" }, { name:"image_4" }, { name: "image_5" }, { name: "image_6" }, { name: "geoJson" }]),projectsController.addProjectMedias);
router.post('/addProjectDocumentation',upload_files.fields([,{ name:"doc_1" }, { name: "doc_2" }, { name: "doc_3" }, { name:"doc_4" }]),projectsController.addProjectDocumentation);
router.post('/editProjectDocumentation',upload_files.fields([,{ name:"doc_1" }, { name: "doc_2" }, { name: "doc_3" }, { name:"doc_4" }]),projectsController.editProjectDocumentation);


module.exports = router;
