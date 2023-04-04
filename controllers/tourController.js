const Tour=require('../models/tourModel');
const APIFeatures=require('./../utils/apiFeatures');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
exports. alliasTopTours=(req,res,next)=>
{
    req.query.limit=5;
    req.query.sort='-ratingsAverage,price';
    req.query.fields='name,price,ratingsAverage,summary,difficulty';
    next();
};       
     
exports. getAlltours=catchAsync(async  (req,res,next)=>
 { 
              
         // execuite query;
        const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;       
        //sending  the response
        res.status(200).json(
            {
               stats:"sucessfull",
               result:tours.length,
               data:
               {
                 tours
               }
              
        });
      
   
 });
 exports.singletour= catchAsync(async (req,res,next)=>
 {  
   
    
   const tour=await Tour.findById(req.params.id);
   if(!tour)
   {
   return next(new AppError('the tour is not found with the given id',404));
   }
   res.status(200).json(
        {
            Status:"sucessfull",
                     data:
           {
            tour
           }
    });
});
   

exports.upadteTour= catchAsync(async(req,res,next)=>
{
   
     const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    if(!tour)
   {
   return next(new AppError('the tour is not found with the given id',404));
   }
   
   res.status(200).json(
       {
           Status:"sucessful",
           data :
           { 
            tour
           }
       }
   );}
   
);
exports.deleteTour=catchAsync(async (req,res,next)=>
    {
        
         const tour = await Tour.findByIdAndDelete(req.params.id);
         if(!tour)
   {
   return next(new AppError('the tour is not found with the given id',404));
   }
       
       res.status(204).json(
           {
               Status:"sucessful",
               message:"the document got deleteed"
               }
       );
   });




exports.creteTour=catchAsync(async (req,res,next) =>{
    const newTour= await Tour.create(req.body);  
    res.status(201).json(
       {
           Status:"sucessful",
           data:{
              newTour
           }
       }
    );
}
);

exports.getTourStats = catchAsync(async (req, res,next) =>
 {
   
    const stats = await Tour.aggregate([
        {
          $match : { ratingsAverage : { $gte: 4.5 } }
        },
        {
          $group: {
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        } ,
        {
            $sort:{avgPrice:1}
        }    
          ]);
            console.log(stats);
            res.status(200).json(
                {
                    Status:"sucessful",
                    message:"from stats",
                    data:
                    {
                        stats
                    }                    
                }
             );
            //  console.log(this.pipeline());
          
   
             
    });
     

 

exports.getMonthlyPlan = catchAsync(async (req,res,next) =>
{
   
        const year= req.params.year*1;
        const plan = await Tour.aggregate([
            
            {
                $unwind:'$startDates'
            },
            { $match:{startDates : {
                    $gte:new Date(`${year}-01-01`),
                    $lte :new Date(`${year}-12-31`)}}
                },
                {$group: 
                {
                    _id:{$month:'$startDates'},
                    numTourStart:{ $sum : 1},
                    tours:{ $push: '$name'}
                }},
                {
                    $addFields:{month:'$-id'}
                },
                {
                    $project:
                    {
                        _id:0
                    }},

                    {
                        $sort:{ numToursStarts:-1}
                    }        
            


        ]);

        res.status(200).json(
            {
                Status:"sucessful",
                results:plan.length,
                message:"from get monthly plane",
                data:
                {
                    plan
                }                    
            })

    
});

