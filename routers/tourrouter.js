const express=require('express');
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const tourController=require(`${__dirname}/../controllers/tourController`);
const router=express.Router();
// router.param("id",tourController.checkId);
router.route('/top-5-cheap').
get(
    tourController.alliasTopTours,
    tourController.getAlltours
    
    );
router.route("/").
get(tourController.getAlltours)
.post(tourController.creteTour);
router.route("/:id").
patch(tourController.upadteTour).
get(tourController.singletour).
delete(tourController.deleteTour); 
module.exports = router;
