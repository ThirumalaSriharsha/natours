const Tour=require('../models/tourModel');
exports. getAlltours=async  (req,res)=>
 { 
    try{
        //bulding a querry
        const queryObj={...req.query};
        console.log(req.query,queryObj);
        const excludeFeilds=['page','sort','limit','fields'];
        excludeFeilds.forEach(el=> delete queryObj[el]);
        let queryStr=JSON.stringify(queryObj);
        //advanced filtering
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>
        `$${match}`);
        console.log(JSON.parse(queryStr));       
         let query= Tour.find(JSON.parse(queryStr));
         // 2) sorting
        if(req.query.sort)
        {
            const sortBy=req.query.sort.split(',').join(' ');
            console.log(sortBy)
            query=query.sort(sortBy);
        }
        else{
            query=query.sort('--createdAt');
        }
       // 3) fields monitoring
        
        if(req.query.fields)
        {
            const fields=req.query.fields.split(',').join(' ');
            //console.log(sortBy)
            query=query.select(fields);
        }
        else{
            query=query.select ('-__v ');
        }
        //pagination 
        // not getting exectuted
         const page = req.query.page*1||1;
         const limit = req.query.limit*1||100;
         const skip = (page-1)*limit;
         query=query.skip(skip).limit(limit);
         if(req.query.page)
         {
            const numTours=await Tours.countDocuments();
            if(skip>numTours)
            throw new Error('this page does not exists');
         }
         
         
        // // execuite query;
        const Tours=await query;
       
        //sending  the response
        res.status(200).json(
            {
               stats:"sucessfull",
               result:Tours.length,
            
               data:
               {
                 Tours
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
}
  
