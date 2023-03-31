const express=require('express');
const router=express.Router();
const userController=require(`${__dirname}/../controllers/userController`);
      
//users routs
router.route("/").
get(userController.getAllUsers)
.post(userController.createUsers);
router.route("/:id").
patch(userController.updateUsers).
get(userController.getOneUsers).
delete(userController.deleteUsers);
module.exports =router;
