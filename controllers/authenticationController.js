const util=require('util');
const crypto=require('crypto');
const jwt = require('jsonwebtoken');
const User=require('./../models/usermodel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const sendEmail=require('./../utils/email');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const { appendFile } = require('fs');
const signToken=id =>
(
    jwt.sign({id:id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES_IN
 })
 );
 const createSendToken=(user,statusCode,res)=>
 {
  const token=signToken(user._id);
  const cookieOptions ={
    expires :new Date(
      Date.now()+process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000
      ),
    // secure:true,
    httpOnly:true
 };
 if(process.env.NODE_ENV === 'production') cookieOptions.secure=true 
  res.cookie('jwt',token,cookieOptions);
  // remove password from showing 
  user.password=undefined;
  res.status(statusCode).json(
     {
         status:'sucessful',
         token,
         data:
         {
             user
         }
     }
  );
  
 }

exports.signUp= catchAsync(async (req,res,next)=>
{ 
     const newUser=  await User.create(
        {
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            passwordConformation:req.body.passwordConformation
        }
     );
      createSendToken(newUser,201,res);
    }
);

exports.login=catchAsync(async (req,res,next) =>
{
    const email =req.body.email;
    const password=req.body.password;
 if(!email||!password)
    { 
               // not going into next the error is in the terminal you can read
          return next(new AppError('pls enter the password and the email id',400));
    }
    // 2)check if user exists password is correct  or not

      const user = await User.findOne({email}).select('+password');
    //   console.log(user);
       if(!user||!(  await user.correctPassword(password,user.password)))
      {
        return next(new AppError('incorrect email or password',401));
      }
    // 3)if all goes well then token send to the client
    createSendToken(user,200,res);
});

exports.protect = catchAsync(async (req,res,next)=>
{
   
    // 1. GETTING TOKEN AND CHECKING OF 
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token=req.headers.authorization.split(' ')[1];
    }
   
    if(!token)
    {
    return next(new AppError ('you are not logged in ! pls log in to get acesss',401));
    }  
    //  2. VERIFICATION OF TOKEN
          const decoded= await util.promisify(jwt.verify)(token,process.env.JWT_SECRET);
          // console.log(decoded);
    // 3. CHECK IF USER STILL EXISTS
    const  currentUser= await User.findById(decoded.id);
    
      if(!currentUser)
    {
     return  next(new AppError ('the token  belong  to the user does not exists ',401));
    }
    // 4.CHECK IF USER CHANGED PASSWORD AFTER THE TOKEN ISSUE
       if(currentUser.changedPasswordAfter(decoded.iat))
       {
          
          return next(new AppError ('your password changed recently ',401));
         
       }
      //  grant acces to protected route
    req.user=currentUser;
       next();
});

exports.restrictTo = (...roles) =>
{
   return (req,res,next) =>
   {
    // the roles will be either (admin and the lead -guide are accessable)
     
      if(!roles.includes(req.user.role))
      {
        return  next(new AppError('your are not permitted',403));
      }
      next();
   }
  
   
}
 exports.forgotPassword = catchAsync(async (req,res,next)=>
 { 
     
    // 1) get the user based on the posted email
         const user=await User.findOne({"email":req.body.email});
         if(!user)
         {
            return next(new AppError('sorry the user not exists for the email',404));
         }
     //2)generating a token
          const resetToken=user.createPasswordResetToken();
           await user.save({validateBeforeSave:false});
    //  3)send it to user email 
            const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
            const message=`forgot your password ? submi a patch request with ypur new password amd password conformation
           to :${resetURL}.\n if you dont forgot your password please ignore the maill`;
           console.log(message);
            try {
               await sendEmail({
                 email: user.email,
                 subject: 'Your password reset token (valid for 10 min)',
                 message
               });
              res.status(200).json({
                 status: 'success',
                 Message: 'Token sent to email!'
               });
             } catch (err) {
               user.passwordResetToken = undefined;
               user.passwordResetExpires = undefined;
               await user.save({ validateBeforeSave: false });
               console.log(err);
               return next(new AppError('there was an error in sending a email... pls try again',500));
            
         };
    
 });


 exports.resetPassword =catchAsync( async(req,res,next)=>
 {
     
   // 1) get the user based on the token
     
     const hashtoken=crypto.createHash('sha256').update(req.params.token).digest('hex');
     const user=await User.findOne({passwordResetToken:hashtoken,passwordResetExpires:{$gt:Date.now()}});
    // 2)if token has not expired and there is a user ,set the passsword 
       if(!user)
       {
         return next(new AppError('the user is invalid or token may have expired',400));
       }
       user.password=req.body.password;
       user.passwordConformation=req.body.passwordConformation;
       user.passwordResetToken=undefined;
       user.passwordResetExpires=undefined;
       await user.save();  
  // 3)update the password with the changed pasword
   // 4) log the user in ,send JWT
   createSendToken(user,200,res);   
 }
 );
 exports.updatePassword=catchAsync( async (req,res,next)=>
 { 
  // 1) get the user from the collection
    const user=await User.findById(req.user.id).select('+password');  
   
  // 2) check  if posted current password is correct 
  if(!(await user.correctPassword(req.body.currentPasword,user.password)))
  {
    return next(new AppError('sorry you have entered a wrong password',401));
  }
  // // 3) if so update the password
  user.password=req.body.password;
  user.passwordConformation=req.body.passwordConformation;
  // await user.save();
  //   // 4) log in and send jwt 
    createSendToken(user,200,res);   
 });



