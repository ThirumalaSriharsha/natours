const User=require('./../models/usermodel');
const AppError=require('./../utils/appError');
const mongoose=require('mongoose');
const catchAsync=require('./../utils/catchAsync');
const Tour=require('./../models/tourModel.js');
const Review = require('../models/reviewModel');
const factory=require('./handlerFactory');

exports.setUserTourId=(req,res,next)=>
{
      // allowed nested routes
      if(!req.body.tour) req.body.tour=req.params.tourId;
      if(!req.body.user)  req.body.user=req.user.id; 
      next();
}

exports.createReview = factory.createOne(Review);
exports.getAllReviews= factory.getAll(Review)
exports.getOneReview=factory.getOne(Review);
exports.updateReview=factory.updateOne(Review);
exports. deleteReview=factory.deleteOne(Review);

