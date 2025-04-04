const User=require("../Models/user.js");

module.exports.getSignup=(req,res)=>{
    res.render("../views/users/signup.ejs")
}


module.exports.submitSignup=async (req,res)=>{
   try{

    let {username,email,password}=req.body
    let newUser=new User({
           email:email,
           username:username
       })
       const registeredUser=await User.register(newUser,password)
       console.log(registeredUser)
    //    to directly login user just after signup
       req.login(registeredUser,(err)=>{
        if(err){
           return next(err)
        }
        req.flash("success",`Welcome ${username} !! You have loggedin Successfully  `)
        let redirectUrl=res.locals.savedRedirectUrl||"/listings"
        res.redirect(redirectUrl)
       })
       
   }
   catch(err){
    req.flash("Error",err.message)
    res.redirect("/signup")
   }
}

module.exports.getLogin=(req,res)=>{
    res.render("../views/users/login.ejs")
}

module.exports.submitLogin=async(req,res,)=>{

    req.flash("success",`Welcome Back! You are Logged In Successfully`)

    let  redirectUrl= res.locals.savedRedirectUrl||"/listings"
    console.log(redirectUrl)
    res.redirect(redirectUrl)
}

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
}