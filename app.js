const path=require('path');
const pug=require('pug');
const express=require('express');
const morgan = require('morgan');
const app=express();
const tourRouter=require(`${__dirname}/routers/tourrouter`);
const userRouter=require(`${__dirname}/routers/userRouter`);
const reviewRouter=require('./routers/reviewRouter');
const AppError=require('./utils/appError');
const errorGlobalHandler=require('./controllers/errorcontroller');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const cookieParser = require('cookie-parser');
const ViewRouter=require(`${__dirname}/routers/viewRouter`);
const bookingRouter=require(`${__dirname}/routers/bookingRouter`);

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'))
// global middlewares
//  serving static files 
app.use(express.static(path.join(__dirname,'public')));
// set HTTP headers
  app.use(helmet());

// development logger
if(process.env.NODE_ENV=== "development")
{
    app.use(morgan('dev'));
};
// limit requests to 200
const limiter=rateLimit({
    max:200,
    windowms:60*60*1000,
    message:"too many requests from the same ip address , try  again in an hour"
});
app.use('/api',limiter);
// body parser reading data from body
app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({
    extended:true,
    limit:'10kb'
}))
app.use(cookieParser());
// data sanitization aganist no sl injection
  app.use(mongoSanitize()); 
// data sanitizatio agan ist xss 
app.use(xss());

// parameter pollution
   app.use(hpp(
    {
        whitelist: 
        ['difficulty',
        'duration',
        'rattingQunatity',
        'rattingAverage',
    'price'
]
    }
   ));
// test middle ware
app.use((req,res,next)=>
{
    req.requesttime=new Date().toISOString();
    // console.log(req.cookies);
    next();
}
);

 app.use("/",ViewRouter);
 app.use("/api/v1/tours",tourRouter);
 app.use("/api/v1/users",userRouter);
 app.use("/api/v1/review",reviewRouter);
 app.use("/api/v1/booking",bookingRouter);
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

