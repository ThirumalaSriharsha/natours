const express=require('express');
const router=express.Router();
const reviewController=require('./../controllers/reviewController');
const authController=require('./../controllers/authenticationController');
 router.route('/').
 post(reviewController.createReview).
 get(authController.protect,authController.restrictTo('user'),reviewController.getAllReviews);
 module.exports = router;