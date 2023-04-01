const mongoose=require('mongoose');
const tourSchema = new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:[true,'a name must be given'],
            unique:true
        },
        rating:
        {
             type : String,
             default:4.5
         },
         price:{
            type:Number,
            required:[true,'a tour must have the price'],
         }
    }
);
const Tour= mongoose.model('Tour',tourSchema)
module.exports=Tour;