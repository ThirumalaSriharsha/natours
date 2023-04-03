const express=require('express');
const morgan = require('morgan');
const app=express();
const tourRouter=require(`${__dirname}/routers/tourrouter`);
const userRouter=require(`${__dirname}/routers/userRouter`);
//middlewares
//console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV=== "development")
{
    app.use(morgan('dev'));
};
app.use(express.json());
app.use((req,res,next)=>
{
    console.log("hello from the middleware👋👋👋");
next();
});
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
     res.status(404).json(
        {
            status:"fail",
            message:`request not drfinrd on thr server ${req.originalUrl }`
        }
     );
     next();
 }

 );

module.exports=app;
//test in ndb
