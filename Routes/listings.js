const express=require("express")
const router=express.Router()
const listing = require("../Models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema}=require("../schema.js")
const customError=require("../utils/customError.js");
const { isLoggedin,isOwner } = require("../middleware.js");
const listingController=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })







const validatenewdata=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",")
        throw new customError(400,errMsg)
    }else{
        next();
    }
}

router.get("/",wrapAsync(listingController.index))


router.get("/newform",isLoggedin,listingController.renderAddform)



router.post("/",isLoggedin,upload.single("newdata[image]"), wrapAsync(listingController.submitAddForm))

  
router.get("/:id", wrapAsync( listingController.showIndividual))


router.delete("/:id/delete",isLoggedin,isOwner, wrapAsync( listingController.deleteIndividual))

// Router.route Functionality
router.route("/:id/edit")
.get( isLoggedin,isOwner,wrapAsync(listingController.editFormRender))

.put( isLoggedin, isOwner,upload.single("newdata[image]"), wrapAsync( listingController.saveEditForm))

  module.exports=router