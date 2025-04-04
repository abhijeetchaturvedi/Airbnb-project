const customError = require("./customError")

module.exports=(fn)=>{
    return function(req ,res,next){
        fn(req ,res,next).catch((err)=>{
            return next(err)
        })
          
    }
}
