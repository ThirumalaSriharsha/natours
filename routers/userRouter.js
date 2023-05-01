const express=require('express');
const router=express.Router();
const userController=require(`${__dirname}/../controllers/userController`);
const authController=require(`${__dirname}/../controllers/authenticationController`);



    
//users routs

router.post('/signup',authController.signUp);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.post('/forgotpassword',authController.forgotPassword);
router.patch('/resetpassword/:token',authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword',authController.updatePassword);
router.patch('/updateMe',userController.uploadUserPhoto,userController.resizeUserPhoto,userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me',
userController.getMe,
userController.getOneUser);

router.use(authController.restrictTo('admin'));

router.route('/').
get(userController.getAllUsers)
.post(userController.createUsers);



router.route('/:id').patch(userController.updateUsers).
get(userController.getOneUser).
delete(userController.deleteUsers);



module.exports =router;




