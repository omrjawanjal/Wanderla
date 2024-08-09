//basic code setup (1)
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//make database for project (4)
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

//TO CALL MAIN FUNCTION (5)
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() { //(4)
    await mongoose.connect(MONGO_URL);
}

//setting views folder(8)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
    },
};

//basic API(3)
app.get("/", (req, res) => {
    res.send("Hi,I am root");
});

app.use(session(sessionOptions));
app.use(flash());

//passport configuring stratergy(15)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success =req.flash("success");
    res.locals.error =req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//     let registerdUser = await User.register(fakeUser,"helloworld");
//     res.send(registerdUser);
// });

// all routes in listing.js 
app.use("/listings",listingRouter);
//all review routes in review.js
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//(14)
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

//CUSTOM ERROR HANDLING(14)
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});

//server start at port 8080 (2)
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

