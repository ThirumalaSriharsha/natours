const User=require('../models/usermodel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
 
const filterObj=(obj,...allowedFields)=>
{
    const newObj={};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el))
         newObj[el]=obj[el];
    });
    return newObj;
}

exports.getAllUsers=catchAsync(async (req,res)=>
{
    const users = await User.find();       
    //sending  the response
    res.status(200).json(
        {
           stats:"sucessfull",
           result:users.length,
           data:
           {
             users
           }
          
    }); 
   
  
}
);

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
exports.getOneUsers=(req,res)=>
{
    res.status(500).json({
        Status:"error",
        message : "the route is not yet defined from the getoneuser method from user controllers"
    });
};
exports.updateUsers=(req,res)=>
{
    res.status(500).json({
        Status:"error",
        message : "the route is not yet defined from update user"
    });
};
exports.deleteUsers=(req,res)=>
{
    res.status(500).json({
        Status:"error",
        message : "the route is not yet defined from delete user"
    });
};
exports. createUsers=(req,res)=>
{
    res.status(500).json({
        Status:"error",
        message : "the route is not yet defined from create user"
    });
};