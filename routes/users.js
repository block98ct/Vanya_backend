const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();
const upload_files = require('../middleware/upload')

router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.post('/resetPassword', userController.resetPassword)
router.get('/verifyhomeUser/:token/:id',userController.verifyhomeUser)


router.post('/forgetPassword', userController.forgetPassword);
router.get('/verifyPassword/:token/',userController.verifyPassword);
router.post('/updatePassword',userController.updatePassword);

router.post('/insertUserRole',userController.insertUserRole);
router.get('/getUserRoleDetails',userController.getUserRoleDetails);
router.post('/insertUserProfileC',userController.insertUserProfileC);  
router.post('/updateUserProfileC',userController.updateUserProfileC);  
router.get('/getUserRoleProfile',userController.getUserRoleProfile);  
router.post('/updateUserProfileImageC',upload_files.fields([{name : "profile_image"}]),userController.updateUserProfileImageC);
router.post('/getAllUserList',userController.getAllUserList);   
router.post('/updateUser',userController.updateUser);  
router.post('/deleteUser',userController.deleteUser);  
router.post('/selectUser',userController.selectUser); 
router.post('/addUser',userController.addUser); 
module.exports = router;