const Tour=require('../models/tourModel');
exports. alliasTopTours=(req,res,next)=>
{
    req.query.limit=5;
    req.query.sort='-ratingsAverage,price';
    req.query.fields='name,price,ratingsAverage,summary,difficulty';
    next();
};
class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(el => delete queryObj[el]);
  
      // 1B) Advanced filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
    paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }        
        
     
exports. getAlltours=async  (req,res)=>
 { 
    try{
        // //filtering
        // const queryObj={...req.query};
        // console.log(req.query,queryObj);
        // const excludeFeilds=['page','sort','limit','fields'];
        // excludeFeilds.forEach(el=> delete queryObj[el]);
        // let queryStr=JSON.stringify(queryObj);
        // //advanced filtering
        // queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>
        // `$${match}`);
        // console.log(JSON.parse(queryStr));       
        //  let query= Tour.find(JSON.parse(queryStr));
         // 2) sorting
        // if(req.query.sort)
        // {
        //     const sortBy=req.query.sort.split(',').join(' ');
        //     console.log(sortBy)
        //     query=query.sort(sortBy);
        // }
        // else{
        //     query=query.sort('--createdAt');
        // }
       // 3) fields monitoring
        
        // if(req.query.fields)
        // {
        //     const fields=req.query.fields.split(',').join(' ');
        //     //console.log(sortBy)
        //     query=query.select(fields);
        // }
        // else{
        //     query=query.select ('-__v ');
        // }
        //pagination 
        // not getting exectuted
        //  const page = req.query.page*1||1;
        //  const limit = req.query.limit*1||100;
        //  const skip = (page-1)*limit;
        //  query=query.skip(skip).limit(limit);
        //  if(req.query.page)
        //  {
        //     const numTours=await Tours.countDocuments();
        //     if(skip>numTours)
        //     throw new Error('this page does not exists');
        //  }
         
         
        // // execuite query;
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
               result:Tours.length,
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
}
  
