const mongoose=require('mongoose');
const slug = require('slug');
const tourSchema = new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:[true,'a name must be given'],
            unique:true,
            maxlength:[40,'name length should not exceed 40 chararcters'],
            minlength:[10,'name length should not be minimum of 10 chararcters']
        },
        slug:{
         type:String,
         default:'the name of the tour'},
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
            required:[true,'a tour must have the difficulity'],
            enum:
            {
               values:['easy','difficult','medium'],
               message:'difficulity may be easy,difficulityor medium'
            }

         },
         rattingAverage:
         {
            type:Number,
            default:4.5,
            min:[1,'ratting must be above 1'],
            max:[5,'ratting must be below 5']
         },
         rattingQunatity:
         {
            type:Number,
            default: 0
         },
         PriceDiscount:
         {
            type: Number,
            validate: { 
               validator:function(val)
            {
                  return val<this.price
            }
         },
         message :'the price discount price must be lessthan given price '
         },
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
            // required:[true,'a tour must have the image cover']
         },
         images:[String],
         createdAt:{
            type:Date,
            default:Date.now(),
            select:false
         },
         startDates:[String],
         secerettour:
         {
            type:Boolean,
            default:false
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



// docu middlewar wich runs before save and create 
// tourSchema.pre('save', function(next)
// {
//     this.slug=slugify(this.name,{lower:true});
//    console.log(this.slug);
//   next();

// }
// );
// tourSchema.post('save',function(doc,next){
//    console.log('from the post middleware',doc);
//    next();
// })



// querry middleware
//  tourSchema.pre('find',function(next)
 tourSchema.pre(/^find/,function(next){
   this.find({secerettour:{$ne:true}});
   this.start = Date.now();
   next();
 });
 tourSchema.post(/^find/,function(doc,next){
   console.log(`the time took to solve the querry is ${Date.now()-this.start} milliseconds`);
   console.log(doc);
   next();
 });
//  aggreate middleware
tourSchema.pre('aggregate',function()
{
   this.pipeline().unshift({$match: {secerettour:{$ne:true}}});
})
tourSchema.virtual('durationinweeks').get(function () {
   return this.duration/7;
});
const Tour= mongoose.model('Tour',tourSchema)
module.exports=Tour;