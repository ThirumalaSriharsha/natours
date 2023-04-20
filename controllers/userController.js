const User=require('../models/usermodel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const factory=require('./handlerFactory');
 
const filterObj=(obj,...allowedFields)=>
{
    const newObj={};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el))
         newObj[el]=obj[el];
    });
    return newObj;
}

exports.getMe=(req,res,next)=>
{
    req.params.id=req.user.id;
    next();
}

exports.updateMe=catchAsync(async (req,res,next)=>
{
    // 1) create  an error if user posts a password
     if(req.body.password||req.body.passwordConformation)
       {
        return next(new AppError('this route is not for the update password pls vist updatateMyPassword route',400));
       }
//    2) filtered out unwated feileds from the body
  
           const filteredBody=filterObj(req.body,'name','email'); 
            // 3) update user document
       const updatedUser= await User.findByIdAndUpdate(req.user.id,filteredBody ,{new:true,runValidators:true});
       
   res.status(200).json(
    {
        status:"sucessful",
        data:
        {
            user : updatedUser
        }
    }
   );
}
);
exports.deleteMe=catchAsync(async (req,res,next)=>
{
   await User.findByIdAndUpdate(req.user.id,{active:false});
   res.status(204).json(
    {
        status:"sucessful",
        data:null
    }
   );
});
exports.getAllUsers=factory.getAll(User);
exports.getOneUser=factory.getOne(User);
// do not update passwords with this
exports.updateUsers=factory.updateOne(User);
exports.deleteUsers=factory.deleteOne(User);
exports. createUsers=factory.createOne(User);