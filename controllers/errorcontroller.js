const AppError=require('../utils/appError');

const handleCastError=err=>{

  const message=`dublicate value :x.please use another value` ;
  // return new AppError(message,400);
};

const handleDublicateFields=err=>{
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message=`invalid  id`;
  return new AppError(message,400);
};

const handleValidationError=err=>{
 const errors=Object.values(err.errors).map(el=>el.message)
  const message=`invalid  input data . ${errors.join('. ')}`;
  return new AppError(message,400);
};
const sendErrorDev=(err,res)=>
{
  res.status(err.statusCode).json(
    {
         status:err.status,
         error:err,
         message:err.message,
         stack:err.stack
    }
);
}
const sendErrorprod=(err,res)=>
{
   if(err.isOperational)
  {
    res.status(err.statusCode).json(
    {
         status:err.status,
         message:err.message,  
         message:"from  operational"    
        
    })
  
}  
  else{

    //  console.error('Error 💥',err);
    res.status(500).json(
      {
           status:'error 💥',
           message:'something went wrong',
           message1:"from not  operational"    
          
      }
      );
  }
  console.log('is operational :',err.isOperational);
}
module.exports=( (err,req,res,next) =>
  { 
    err.statusCode=err.statusCode||500;
    err.status=err.status||'Error';
    if (process.env.NODE_ENV === 'development')
   {
     sendErrorDev(err,res);
     console.log(process.env.NODE_ENV);
      }
      else if(process.env.NODE_ENV === 'production')
      {
        console.log(process.env.NODE_ENV);
         let error = {...err};
         if(error.name ==='CastError')    
         error =handleCastError(error);
         if(error.code === 11000) 
         error =handleDublicateFields(error);  
         if(error.validation === 'validationError') 
         error =handleValidationError(error);  
         sendErrorprod(error,res);
              
      }
    }
);
     