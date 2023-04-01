const Tour=require('../models/tourModel');
exports. getAlltours=async  (req,res)=>
 { 
    try{
        const Tours=await Tour.find();
        res.status(200).json(
            {
               stats:"sucessfull",
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
       message:"error 💥💥"
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
  
