const User=require('../models/usermodel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const factory=require('./handlerFactory');
const multer=require('multer');
const sharp=require('sharp')


// const multerStorage=multer.diskStorage(
//     {
//         destination:(req,file,cb)=>
//         {
//             cb(null,'public/img/users');
//         },
//         filename:(req,file,cb)=>
//         {
//             const ext=file.mimetype.split('/')[1];
//             cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
//         }
//     }
// );

const multerStorage=multer.memoryStorage();

const multerFilter=(req,file,cb)=>
{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }

    else{
        cb(new AppError('not an image !please try again',404),false);
    }
};

const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
});

exports.uploadUserPhoto=upload.single('photo');

exports.resizeUserPhoto= catchAsync (async (req,res,next)=>
{
    if(!req.file)
     {
        return next();
    }

    req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality:90}).
    toFile(`public/img/users/${req.file.filename}`);

    next();
});
 
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
    // console.log(req.file);
    // console.log(req.body);
    // 1) create  an error if user posts a password
     if(req.body.password||req.body.passwordConformation)
       {
        return next(new AppError('this route is not for the update password pls vist updatateMyPassword route',400));
       }
//    2) filtered out unwated feileds from the body
  
           const filteredBody=filterObj(req.body,'name','email');
            if(req.file)
             {
                filteredBody.photo=req.file.filename; 
             }
           
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