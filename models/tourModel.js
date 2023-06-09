const mongoose=require('mongoose');
const slugify = require('slugify');
const User=require('./usermodel');
const { promises } = require('nodemailer/lib/xoauth2');
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
        slug: String,
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
         ratingsAverage:
         {
            type:Number,
            default:4.5,
            min:[1,'ratting must be above 1'],
            max:[5,'ratting must be below 5'],
            set: val => Math.round(val*10)/10
            // thw above set value is usaed to round off the decimal ex:4.66=> 4.7
         },
         ratingsQuantity:
         {
            type:Number,
            default:0
            
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
         },
         startLocation:
         {
            // geoJSON
            type:
            {
               type:String,
               default:'Point',
               enum:['Point']
            },
            coordinates:[Number],
            address:String,
            description:String
         },
         
  locations:[
   {
      // geoJSON
      type:
      {
         type:String,
         default:'Point',
         enum:['Point']
      },
      coordinates:[Number],
      address:String,
      description:String,
      day:Number 
   }
  ],
  guides:
  [
   {
      type:mongoose.Schema.ObjectId,
      ref:'User'
   }  
   
  ] 
  
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


// tourSchema.index({
//    price: 1 
// });
tourSchema.index({
   price: 1 ,
   rattingAverage: -1
});
tourSchema.index({ startLocation:'2dsphere'});
// docu middlewar wich runs before save and create 
tourSchema.pre('save', function(next) {
   this.slug = slugify(this.name, { lower: true });
   next();
 });

// tourSchema.pre('save', async function(next)
// {
//    const guidesPromises = this.guides.map(async id => await User.findById(id));
//    this.guides=await Promise.all(guidesPromises);
//    next();
// });

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
 tourSchema.pre(/^find/,function(next)
 {
   this.populate (
      {
       path:'guides',
       select:'-passwordChangedAt -__v'
      }
   );
   next();
 });
 tourSchema.post(/^find/,function(doc,next){
   // console.log(`the time took to solve the querry is ${Date.now()-this.start} milliseconds`);
   
   next();
 });
//  aggreate middleware
// tourSchema.pre('aggregate',function()
// {
//    this.pipeline().unshift({$match: {secerettour:{$ne:true}}});
// });
tourSchema.virtual('durationinweeks').get(function () {
   return this.duration/7;
});
// virutual populate
tourSchema.virtual('reviews',{
  ref:'Review',
  foreignField:'tour',
  localField:'_id'

});
const Tour= mongoose.model('Tour',tourSchema)
module.exports=Tour;