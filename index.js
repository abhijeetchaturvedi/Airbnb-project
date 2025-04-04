if(process.env.NODE_ENV!="production"){
    require('dotenv').config()

}
// console.log(process.env)
const RentifyDB_URL = process.env.ATLAS_DB_URL

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")
const flash=require("connect-flash")
const methodOverride = require('method-override')
const customError=require("./utils/customError.js")
const wrapAsync = require("./utils/wrapAsync.js")
const ejsMate = require('ejs-mate')
const {listingSchema}=require("./schema.js")
const {reviewSchema}=require("./schema.js")
const review=require("./Models/review.js")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./Models/user.js")
const {isLoggedin}=require("./middleware.js")

const session=require("express-session")
const MongoStore = require('connect-mongo');
const store = MongoStore.create({
    mongoUrl: RentifyDB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
store.on("error",()=>{
    console.log("Error in Mongo session Store")
})
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true

    }
}


app.use(flash())
app.use(session(sessionOptions))
app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

// const RentifyDB_URL = "mongodb://127.0.0.1:27017/RentifyDB"



const listing = require("./Models/listing.js");
const listingRoutes=require("./Routes/listings.js")
const reviewRoutes=require("./Routes/reviews.js")
const userRoutes=require("./Routes/user.js")

app.use(passport.session())
app.use(passport.initialize())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success")
    res.locals.errorMsg=req.flash("error")
    res.locals.currentUser=req.user
    
    next()
})

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"mrabhijete@gmail.com",
//         username:"_ig__abhijeet"
//     })
//     let registerdUser=await User.register(fakeuser,"helloworld")
//     res.send(registerdUser)
// })

app.use("/listings",listingRoutes)
app.use("/listings/:id/reviews",reviewRoutes)
app.use("/",userRoutes)
async function main() {
    await mongoose.connect(RentifyDB_URL);

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main()
    .then(() => {
        console.log("Connected to DB")
    })
    .catch((err) => {
        console.log(err)
    });








app.listen(8080, () => {
    console.log("Listening on 8080");
})

app.get("/", (req, res) => {
    res.redirect("/listings");
})
// for the Testing 
// app.get("/testlisting",async (req,res)=>{

//     const newlist = new listing({
//         title: 'Beautiful Beach House',
//         description: 'A beautiful house located on the beach, perfect for vacations.',
//         image: 'https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg',
//         price: 300000,
//         location: 'Malibu, California',
//         country: 'USA'
//       });


//       await newlist.save().then((result)=>{
//         console.log("saved entry",result)
//         res.send("Saved Suceesfully")
//       }).catch((err)=>{
//         console.log(err)
//       })
// })



app.all("*", (req, res, next) => {
    next(new customError(404, "PAGE NOT FOUND"))
})
app.use((err, req, res, next) => {

    let { status=500, message="Something Wenttt Wrong" } = err
    res.status(status)
    res.render("error.ejs",{err})
})