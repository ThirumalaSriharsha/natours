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

reviewSchema.pre(/^find/,function(next)
 {
   this.populate (
      {
       path:'tour',
       select:'name '
      }
   );
   this.populate (
    {
     path:'user',
     select:'name '
    }
 );
   next();
 });

const Review= mongoose.model('Review',reviewSchema);
module.exports=Review;