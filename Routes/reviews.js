const express = require("express");
const router=express.Router({mergeParams:true})
const {reviewSchema}=require("../schema.js")
const {listingSchema}=require("../schema.js")
const review=require("../Models/review.js")
const wrapAsync = require("../utils/wrapAsync.js")  
const listing = require("../Models/listing.js");
const customError=require("../utils/customError.js")
const {validatereview,isLoggedin,reviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/review.js")




router.route("/")
.get(reviewController.showReview)


.post( isLoggedin,validatereview ,wrapAsync (reviewController.addReview)
)


router.delete("/:reviewid",isLoggedin, reviewAuthor,wrapAsync(reviewController.deleteReview))


module.exports=router