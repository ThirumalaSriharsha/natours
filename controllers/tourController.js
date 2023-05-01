const multer=require('multer');
const sharp=require('sharp');
const Tour=require('../models/tourModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const factory=require('./handlerFactory');
const Review = require('../models/reviewModel');
const { promises } = require('nodemailer/lib/xoauth2');


const multerStorage=multer.memoryStorage();

const multerFilter=(req,file,cb)=>
{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }

    else{
        cb(new AppError('not an image !please try again',404),false);
    }
};

const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
});


exports.uploadTourImages=upload.fields([
    {
        name:'imageCover',
        maxCount:1
    },
    {
        name:'images',
        maxCount:3
    }
]);


exports.resizeTourImages= catchAsync(async (req,res,next)=>
{
    // console.log(req.files);

    if(!req.files.imageCover|| !req.files.images) return next();

    // 1)cover image
    req.body.imageCover=`tour-${req.params.id}-${Date.now()}-cover.jpeg`;
     await sharp(req.files.imageCover[0].buffer)
    .resize(2000,1333)
    .toFormat('jpeg')
    .jpeg({quality:90}).
    toFile(`public/img/tours/${req.body.imageCover}`);

    // 2)  images
   req.body.images=[]
    await Promise.all(
        req.files.images.map(async (file,i)=>
        {
            const filename =`tour-${req.params.id}-${Date.now()}-${i+1}.jpeg`;
            
            await sharp(file.buffer)
            .resize(2000,1333)
            .toFormat('jpeg')
            .jpeg({quality:90}).
            toFile(`public/img/tours/${filename}`);

            req.body.images.push(filename);

            console.log(req.body);
            
        })
    );
     

    next(); 
});

exports.alliasTopTours=(req,res,next)=>
{
    req.query.limit=5;
    req.query.sort='-ratingsAverage,price';
    req.query.fields='name,price,ratingsAverage,summary,difficulty';
    next();
};       
     
exports.getAlltours=factory.getAll(Tour);
exports.singletour= factory.getOne(Tour,{path:'reviews'});
exports.upadteTour= factory.updateOne(Tour);
exports.deleteTour=factory.deleteOne(Tour);
exports.creteTour=factory.createOne(Tour);

exports.getTourStats = catchAsync(async (req,res,next) =>
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


// router.route('/tour-within/:distance/center/:latlon/unit/:unit',tourController.getToursWithin);  

exports. getToursWithin=catchAsync (async (req,res,next)=>
{
    const {distance , latlon , unit}= req.params;
    const [lat,lon] =latlon .split(',');
    const radius=unit === 'mi'?distance/3963.2: distance/6378.1;
    if(!lat||!lon)
    {
        return next(new AppError("please enter the lat or logitude of your location",400));
    };


     const tours = await Tour.find({startLocation:
        {$geoWithin:{
            $centerSphere: [[lon,lat],radius]
        }
     }
    });


    console.log(distance ,lat,lon,unit );
    res.status(200).json({
        status:"sucess",
        results:tours.length,
        data :
        {
            data:tours
        }

    });
}
);

exports.getDistances=catchAsync(async (req,res,next) =>
{
    const { latlon , unit}= req.params;
    const [lat,lon] =latlon .split(',');
        if(!lat||!lon)
    {
        return next(new AppError("please enter the lat or logitude of your location",400));
    };

     const Multiplier = unit === 'mi' ? 0.000621371:0.001;
    const distances=  await Tour.aggregate([
       {
        $geoNear: {
            near: {
              type: 'Point',
              coordinates: [lon  * 1, lat * 1]
            },
            distanceField: 'distance',
            distanceMultiplier:Multiplier

       }       
    },
    {
        $project: {
            distance:1,
            name:1
        }
    }

    ]
    );
    console.log(distances);
 
    res.status(200).json({
        status:"sucess",
        data :
        {
            data:distances
        }

    });



}

);

