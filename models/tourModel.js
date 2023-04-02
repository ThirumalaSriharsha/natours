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
            required:[true,'a tour must have the price']
         },
         duration:{
            type:Number,
            required:[true,'a tour must have the duration']
         },
         maxGroupSize:
         {
            type: Number,
            required:[true,'a tour must have the groupsize']

         },
         difficulty:
         {
            type:String,
            required:[true,'a tour must have the difficulity']

         },
         rattingAverage:
         {
            type:Number,
            default:4.5
         },
         rattingQunatity:
         {
            type:Number,
            default: 0
         },
         PriceDiscount:Number,
         summary:
         {
            type:String,
            trim:true,
            required:[true,'a tour must have the summary']
         },
         description:
         {
            type:String,
            trim:true,
            required:[true,'a tour must have the description']
         },
         imageCover:
         {
            type:String,
            required:[true,'a tour must have the image cover']
         },
         images:[String],
         createdAt:{
            type:Date,
            default:Date.now(),
            select:false
         },
         startDates:[String]

    }
    ,{
      toJSON:{
         virtuals:true
      },
      toObject:{
         virtuals:true
      }
    }
);
tourSchema.virtual('durationinweeks').get(function () {
   return this.duration/7;
});
const Tour= mongoose.model('Tour',tourSchema)
module.exports=Tour;