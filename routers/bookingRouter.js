const express=require('express');
const { route } = require('../app');
const router=express.Router();
const bookingController=require(`${__dirname}/../controllers/bookingController`);
const authController=require(`${__dirname}/../controllers/authenticationController`);

router.get('/Checkout-session/:tourId',authController.protect,bookingController.getCheckoutSession);





module.exports =router;




