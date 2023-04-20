const express=require('express');
const router=express.Router({mergeParams:true});
const reviewController=require('./../controllers/reviewController');
const authController=require('./../controllers/authenticationController');
 router.route('/').
 post(authController.protect,authController.restrictTo('user'),reviewController.setUserTourId,reviewController.createReview).
 get(reviewController.getAllReviews);

 router.route('/:id').
 delete(reviewController.deleteReview)
 .patch(reviewController.updateReview).
 get(reviewController.getOneReview);
 module.exports = router;