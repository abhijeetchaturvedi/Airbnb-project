const joi=require("joi")

module.exports.listingSchema=joi.object({

    newdata:joi.object({ 
        
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required().min(0),
        imgpassed:joi.string().allow("",null),
       }).required()


    })
module.exports.reviewSchema=joi.object({
       review:joi.object({ 
        rating:joi.string().required().min(1).max(5),
        comment:joi.string().required()
       }).required()
    })