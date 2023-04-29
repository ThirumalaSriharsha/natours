const express=require('express');
const router=express.Router();
const viewController=require('./../controllers/viewController');
const authController=require('./../controllers/authenticationController');

router.get('/',authController.isLogedIn,viewController.getOverview);
router.get('/tour/:slug',authController.isLogedIn,viewController.getTour);
router.get('/login',authController.isLogedIn,viewController.getloginForm);
router.get('/me',authController.protect,viewController.getAccount);
router.post('/submit-user-data',authController.protect,viewController.updateUserData);

module.exports=router;