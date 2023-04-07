const express=require('express');
const router=express.Router();
const userController=require(`${__dirname}/../controllers/userController`);
const authController=require(`${__dirname}/../controllers/authenticationController`);
      
//users routs
router.route("/").
get(userController.getAllUsers)
.post(userController.createUsers);
router.route("/:id").
patch(userController.updateUsers).
get(userController.getOneUsers).
delete(userController.deleteUsers);
module.exports =router;

// signup route
router.post('/signup',authController.signUp);
router.post('/login',authController.login);


