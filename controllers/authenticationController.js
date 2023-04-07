const jwt = require('jsonwebtoken');
const User=require('./../models/usermodel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const signToken=id =>
(
    jwt.sign({id:id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES_IN
 })
 );

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
     const token=signToken(_id);
     res.status(201).json(
        {
            status:'sucessful',
            token,
            data:
            {
                user:newUser
            }
        }
     );  
    }
);

exports.login=catchAsync(async (req,res,next) =>
{
    const email =req.body.email;
    const password=req.body.password;
 if(!email||!password)
    { 
        console.log(" your in the if block");
        // not going into next the error is in the terminal you can read
          return next(new AppError('pls enter the password and the email id',400));
    }
    // 2)check if user wxists password is correct  or not

      const user = await User.findOne({email}).select('+password');
      console.log(user);
       if(!user||!(  await user.correctPassword(password,user.password)))
      {
        return next(new AppError('incorrect email or password',401));
      }
    // 3)if all goes well then token send to the client
    const token= signToken(user._id);
    res.status(200).json({
        status:"sucesss",
        token
    });
});