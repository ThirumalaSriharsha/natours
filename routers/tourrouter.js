const express=require('express');
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const tourController=require(`${__dirname}/../controllers/tourController`);
const authController=require('./../controllers/authenticationController');
const router=express.Router();
// router.param("id",tourController.checkId);
router.route('/top-5-cheap').
get(
    tourController.alliasTopTours,
    tourController.getAlltours
    
    );
// routes for overview
router.route("/").
get(authController.protect, 
    tourController.getAlltours)
.post(tourController.creteTour);
// routes for the id based operations
router.route("/:id").
patch(tourController.upadteTour).
get(tourController.singletour).
delete(authController.protect,
       authController.restrictTo('admin','lead-guide'), 
        tourController.deleteTour); 
// routes for tour status,tour plan
router.route("/tour-stats").get(tourController.getTourStats);
router.route("/tour-plan/:year").get(tourController.getMonthlyPlan);

module.exports = router;
