const listing = require("./Models/listing.js");
const customError=require("./utils/customError.js")
const {reviewSchema}=require("./schema.js")
const review=require("./Models/review.js")
module.exports.isLoggedin=(req,res,next)=>{
    console.log("isLoggedin middleware called");
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        console.log(req.session.redirectUrl)
        req.flash("error","You Must be Logged-In")
        return res.redirect("/login")
    }
    next()
}
module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.savedRedirectUrl=req.session.redirectUrl
    }
next()
}


module.exports.isOwner=async (req,res,next)=>{
    let{id}=req.params
    let data=await listing.findById(id).populate("owner")
    console.log("mw called of iswoner")
    console.log("data.owner",data.owner)
    console.log("data.res.locals.currentUser._id",res.locals.currentUser._id)
  

    if(!data.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You Dont Have PermIsiion to Edit")
        return res.redirect(`/listings/${id}`)
    }

next()
}


module.exports.validatereview=(req,res,next)=>{
    console.log("wen validate review")
    let {error}=reviewSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",")
        throw new customError(400,errMsg)
    }else{
        next();
    }
}
module.exports.reviewAuthor=async (req,res,next)=>{
    let {reviewid,id}=req.params
    console.log(reviewid,id)
   let userreview=await review.findById(reviewid)
   if(!userreview.author.equals(res.locals.currentUser._id)){
    req.flash("error","you are Not the author")
    return res.redirect(`/listings/${id}`)
   }
   next()
}