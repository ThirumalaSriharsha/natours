const User=require('./../models/usermodel');
const AppError=require('./../utils/appError');
const mongoose=require('mongoose');
const catchAsync=require('./../utils/catchAsync');
const Tour=require('./../models/tourModel.js');
const Review = require('../models/reviewModel');

exports.createReview = catchAsync(async (req,res,next)=>
{
   const newReview=await Review.create(req.body);
 
   res.status(201).json(
    {
        status:"sucessful",
        
        data:
        {
            newReview
        }
    }
   );

});

exports.getAllReviews= catchAsync(async (req,res,next)=>
{
   const review=await Review.find();
   if(!review)
   {
   return next(new AppError('there are no reviews at',404));
   }
   res.status(200).json(
        {
            Status:"sucessfull",
            results:review.length,
            data:
           {
            review
           }
    });

    
});
