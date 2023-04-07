const User=require('../models/usermodel');
const catchAsync=require('./../utils/catchAsync');
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
exports.getOneUsers=(req,res)=>
{
    res.status(500).json({
        Status:"error",
        message : "the route is not yet defined"
    });
};
exports.updateUsers=(req,res)=>
{
    res.status(500).json({
        Status:"error",
        message : "the route is not yet defined"
    });
};
exports.deleteUsers=(req,res)=>
{
    res.status(500).json({
        Status:"error",
        message : "the route is not yet defined"
    });
};
exports. createUsers=(req,res)=>
{
    res.status(500).json({
        Status:"error",
        message : "the route is not yet defined"
    });
};