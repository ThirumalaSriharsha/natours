const mongoose=require("mongoose");
const Tour = require("./tourModel");
const User = require("./usermodel");

const reviewSchema= new mongoose.Schema(
    {
        review:
        {
            type:String,
          required:[true,'please wrote the review'] 
        }, 
        ratting:
        {
            type:Number,
            min:1,
            max:5
        },
        createdAt:
        { 
            type:Date,
             default:Date.now() 
        },
        tour:  
            
            {
                type:mongoose.Schema.ObjectId,
                ref:Tour,
                required:[true,'review must belong to tour']
            }

        ,
        user:        
             {
                type:mongoose.Schema.ObjectId,
                ref:User,
                required:[true,'review must belong to user']
            }

     
         
    },

    {
        toJSON:{
           virtuals:true
        },
        toObject:{
           virtuals:true
        }
      }
);

  reviewSchema.index({
    user:1,
    tour:1
  },
  {
    unique:true
  })

reviewSchema.pre(/^find/,function(next)
 {
  //  this.populate (
  //     {
  //      path:'tour',
  //      select:'name '
  //     }
  //  );
   this.populate (
    {
     path:'user',
     select:'name '
    }
 );
   next();
 });

 reviewSchema.statics.calcAverageRatting=async function(tourId)
 {
    const stats = await this.aggregate([
        {
          $match: { tour: tourId }
        },
        {
          $group: {
            _id: '$tour',
            nRating: { $sum: 1 },
            avgRating: { $avg: '$ratting' }
          }
        }
      ]);
    //   console.log(stats);

  if(stats.length>0){
      await Tour.findByIdAndUpdate(
        tourId,{
        rattingQunatity:stats[0].nRating,
        rattingAverage:stats[0].avgRating
      })
    }
     else {
        await Tour.findByIdAndUpdate(
            tourId,{
            rattingQunatity:0,
            rattingAverage:4.5
          });
     }
 };


 reviewSchema.post('save',function(next){
    this.constructor.calcAverageRatting(this.tour);
  
 });
 reviewSchema.pre(/^findOneAnd/,async function (next)
 {
    this.r=await this.findOne();
    // console.log(this.r);
    next();
 });
  reviewSchema.post(/^findOneAnd/,async function ()
  {
    // await this .findOne ; does not work herer ,query is alredy executed
    await this.r.constructor.calcAverageRatting(this.r.tour);
  });

const Review= mongoose.model('Review',reviewSchema);
module.exports=Review;