const express=require('express');
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const tourController=require(`${__dirname}/../controllers/tourController`);
const authController=require('./../controllers/authenticationController');
const reviewRouter=require('./reviewRouter');
const router=express.Router();
router.use('/:tourId/review',reviewRouter);
router.route('/top-5-cheap').
get(
    tourController.alliasTopTours,
    tourController.getAlltours
    
    );
     // routes for tour status,tour plan
router.route("/tour-stats").get(tourController.getTourStats);
router.route("/tour-plan/:year").
         get(authController.protect,
         authController.restrictTo('admin','lead-guide'),
         tourController.getMonthlyPlan);

router.route('/tour-within/:distance/center/:latlon/unit/:unit').get (tourController.getToursWithin); 
router.route('/distance/:latlon/unit/:unit').get(tourController.getDistances);        
// routes for overview
router.route("/").
get(tourController.getAlltours)
.post(authController.protect,
       authController.restrictTo('admin','lead-guide'),
       tourController.creteTour);
// routes for the id based operations
router.route("/:id").
patch( 
       authController.protect,
       authController.restrictTo('admin','lead-guide'),
       tourController.uploadTourImages,
       tourController.resizeTourImages,
       tourController.upadteTour).
get(tourController.singletour).
delete(authController.protect,
       authController.restrictTo('admin','lead-guide'), 
        tourController.deleteTour); 



module.exports = router;
