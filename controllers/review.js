const listing = require("../Models/listing.js");
const review = require("../Models/review.js");
module.exports.showReview=(req,res)=>{
    res.redirect(`/listings/${req.params.id}`)
}



module.exports.addReview=async(req,res)=>{
    let listing1 =await listing.findById(req.params.id )
let newReview=new review(req.body.review)
newReview.author=req.user._id
console.log(newReview)
listing1.reviews.push(newReview)
await newReview.save()
await listing1.save()
console.log("New review Added")
req.flash("success","Your Review submitted Successfully")
res.redirect(`/listings/${listing1._id}`)
}



module.exports.deleteReview=async (req,res)=>{
    console.log(req.params)
    let{id,reviewid}=req.params
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
    await review.findByIdAndDelete(reviewid)
    req.flash("success","Your Review Deleted Successfully")
    // .then(()=>{
    //     console.log("Review Deletedt")
    // })
res.redirect(`/listings/${id}`)

}