const { Model, model } = require('mongoose');
const AppError=require('./../utils/appError');
const catchAsync=require('./../utils/catchAsync');
const APIFeatures=require('./../utils/apiFeatures');

// deleteing the documents
exports.deleteOne=Model=>
catchAsync(async (req,res,next)=>
{
       const doc = await Model.findByIdAndDelete(req.params.id);
     if(!doc)
{
return next(new AppError('the document is not found with the given id',404));
}
   
   res.status(204).json(
       {
           Status:"sucessful",
           message:"the document got deleteed"
           }
   );
});
// updating one  the documents
exports.updateOne=Model=>catchAsync(async(req,res,next)=>
{ 
     
    let id = req.params.id;

      

    //   console.log(id);
     const doc = await Model.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true
    });
    if(!doc)
   {
   return next(new AppError('the document is not found with the given id',404));
   }
   
   res.status(200).json(
       {
           Status:"sucessful",
           data :
           { 
            data : doc
           }
       }
   );
});

// creating the documents
exports.createOne=Model=>catchAsync(async (req,res,next) =>{
    const newDoc= await Model.create(req.body);  
    res.status(201).json(
       {
           Status:"sucessful",
           data:{
              data:newDoc
           }
       }
    );
}
);

//  get single  the documents
exports.getOne=(Model,popOptions)=>
 
    catchAsync(async (req,res,next)=>
 {  
   let query=Model.findById(req.params.id);
   if(popOptions)
   query=Model.findById(req.params.id).populate(popOptions);
    
   const doc=await query;
   if(!doc)
   {
   return next(new AppError('the document is not found with the given id',404));
   }
   res.status(200).json(
        {
            Status:"sucessfull",
                     data:
           {
            data : doc
           }
    });
});

// getting all  the documents

exports.getAll=Model=>
catchAsync(async  (req,res,next)=>
 {            
    let filter = {};
    if(req.params.tourId)
    {
       filter={ tour:req.params.tourId}
    }
     // execuite query;
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;       
        //sending  the response
        res.status(200).json(
            {
               stats:"sucessfull",
               result:doc.length,
               data:
               {
                 data : doc
               }
              
        });
         
 });




