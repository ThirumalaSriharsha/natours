const express=require('express');
const morgan = require('morgan');
const app=express();
const tourRouter=require(`${__dirname}/routers/tourrouter`);
const userRouter=require(`${__dirname}/routers/userRouter`);
const AppError=require('./utils/appError');
const errorGlobalHandler=require('./controllers/errorcontroller');
//middlewares
//console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV=== "development")
{
    app.use(morgan('dev'));
};
app.use(express.json());
app.use((req,res,next)=>
{
    req.requesttime=new Date().toISOString();
    next();
}
);
 app.use("/api/v1/tours",tourRouter);
 app.use("/api/v1/users",userRouter);


 app.all('*',(req,res,next)=>
 {

    // const err = new Error(`request not defind on thr server ${req.originalUrl }`);
    // err.status='fail';
    // err.statusCode=404;
     next( new AppError(`request not defind on thr server ${req.originalUrl }`,404));
 }
  );
   
  app.use(errorGlobalHandler);

module.exports=app;

