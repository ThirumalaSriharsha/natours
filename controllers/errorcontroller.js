const AppError=require('../utils/appError');

const handleCastError=err=>{

  return new AppError(`dublicate value :x.please use another value`,400);
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
 const handleJswError= () =>   {
  return new AppError(' invalid token . pls loggin again',401);
 }
 const handleJswExpiredError=() =>
 {
  return new AppError(' sorry your token expirerd ...',401);
 }
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
         message:err.message  
          
    });
  
}    else{
     console.error('Error 💥',err);
    res.status(500).json(
      {
           status:'error 💥',
           message:'something went wrong',
           message1:"from not  operational"    
          
      }
      );
  }
}
module.exports=( (err,req,res,next) =>
  { 
    err.statusCode=err.statusCode||500;
    err.status=err.status||'Error';
    if (process.env.NODE_ENV === 'development')
   {
     sendErrorDev(err,res);
    
      }
      else if(process.env.NODE_ENV === 'production')
      {
         let error = {...err};
         //handling mongoose in valid id errors
         if(error.name ==='CastError')    
         error =handleCastError(error);
         //handling mongoose duplication error
         if(error.code === 11000) 
         error =handleDublicateFields(error); 
         //handling mongoose validation error 
         if(error.validation === 'validationError') 
         error =handleValidationError(error); 
          //  handling jsw error
         if(error.message='JsonWebTokenError') 
          error=handleJswError();
          // handling token expired error
          if(error.message='tokenExpiredError') 
          error=handleJswExpiredError();
         sendErrorprod(error,res);
              
      }
    }
);
     