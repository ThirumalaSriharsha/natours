const Tour=require('../models/tourModel');
const APIFeatures=require('./../utils/apiFeatures');
exports. alliasTopTours=(req,res,next)=>
{
    req.query.limit=5;
    req.query.sort='-ratingsAverage,price';
    req.query.fields='name,price,ratingsAverage,summary,difficulty';
    next();
};       
     
exports. getAlltours=async  (req,res)=>
 { 
    try{          
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
      
    }
    catch(err)
    {
        res.status(404).json({
       status: "fail",
       message:err
        }
    );}
    
 };
 exports.singletour= async (req,res)=>
 {  
    try{
    //const objid=;
   const tour=await Tour.findById(req.params.id);
   res.status(200).json(
        {
            Status:"sucessfull",
                     data:
           {
            tour
           }
    });
   
    }
    catch(err)
    {
        res.status(404).json({
       status: "fail",
       message:err
        }
    );}
    
};
exports.upadteTour= async(req,res)=>
{
    try{
     const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
   
   res.status(200).json(
       {
           Status:"sucessful",
           data :
           { 
            tour
           }
       }
   );}
   catch(err)
   {
       res.status(404).json({
      status: "fail",
      message:"error 💥💥 from the update querry"
       }
   );}
};
exports.deleteTour=async (req,res)=>
    {
        try{
         const tour = await Tour.findByIdAndDelete(req.params.id);
       
       res.status(204).json(
           {
               Status:"sucessful",
               message:"the document got deleteed"
               }
       );
    }
    catch(err)
   {
       res.status(404).json({
      status: "fail",
      message:"error 💥💥 from the Delete querry",
      message2:err
       }
   );}


};

exports.creteTour=async (req,res) =>{
try
{
  const newTour= await Tour.create(req.body);  
    res.status(201).json(
       {
           Status:"sucessful",
           data:{
              newTour
           }
       }
    );
 
} catch(err)
{
    res.status(400).json (
        {
            message:err
        }
    );
}
};

exports.getTourStats = async (req, res) =>
 {
    try{
    const stats = await Tour.aggregate([
        {
          $match: { ratingsAverage : { $gte: 4.5 } }
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
          
    }
    catch(err)
    {
        res.status(404).json({
            status: "fail",
            message:"error 💥💥 from the tour stats",
            message2:err
             });
             
    }
     
}
 

exports.getMonthlyPlan = async (req,res) =>
{
    try{
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

    }
    catch(err)
    {
        res.status(404).json({
            status: "fail",
            message:"error 💥💥 from the get monthli plan",
            message2:err
             });
    }
}
  
