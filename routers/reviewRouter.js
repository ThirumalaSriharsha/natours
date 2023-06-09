const express=require('express');
const router=express.Router({mergeParams:true});
const reviewController=require('./../controllers/reviewController');
const authController=require('./../controllers/authenticationController');
router.use(authController.protect);
router.route('/').
 post(authController.restrictTo('user')
 ,reviewController.setUserTourId,
 reviewController.createReview).
 get(reviewController.getAllReviews);

 router.route('/:id').
 delete(
    authController.restrictTo('user','admin'),
    reviewController.deleteReview)
 .patch(
    authController.restrictTo('user','admin')
    ,reviewController.updateReview).
 get(reviewController.getOneReview);
 module.exports = router;