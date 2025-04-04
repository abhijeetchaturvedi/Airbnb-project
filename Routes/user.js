const express = require("express");
const app=express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const router=express.Router()
const User=require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport")
const {savedRedirectUrl}=require("../middleware.js")
const userController=require("../controllers/user.js")

router.route("/signup")
.get(userController.getSignup)
.post(wrapAsync(userController.submitSignup))



router.route("/login")
.get(userController.getLogin)

.post(savedRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
     userController.submitLogin) 




router.get("/logout", userController.logout);


module.exports=router