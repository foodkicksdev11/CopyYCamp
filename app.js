
if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}




// require("dotenv").config();

// console.log(process.env.SECRET);

// require express
const express = require("express");

const path = require("path");

// require ejs-mate
const ejsMate = require("ejs-mate");

// const Campground = require("./models/campground");

// const Review = require("./models/review");

const methodOverride = require("method-override"); //--> this is for the Edit/Update and Delete Section of our Crud to override the default method of submitting the form

// require express-session
const session = require("express-session");

// require MongoStore
const MongoStore = require("connect-mongo");

// require connect-flash
const flash = require("connect-flash");

// require passport
const passport = require("passport");

// require passport-local
const LocalStrategy = require("passport-local");

// require User
const User = require("./models/user");

// require ExpressError
const ExpressError = require("./utils/ExpressError");

// require router
const userRoutes =  require("./routes/users");


// require the campgrounds.js from our routes directory then we use it here with app.use
const campgroundRoutes = require("./routes/campgrounds");


const reviewRoutes = require("./routes/reviews");


const mongoSanitize = require('express-mongo-sanitize');


// require helmet
const helmet = require("helmet");


// const dbUrl = process.env.DB_URL;

// mongoDB_url
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";                                       //process.env.DB_URL;

// require mongoose
const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

//   'mongodb://127.0.0.1:27017/yelp-camp'
}


const app = express();

app.engine("ejs", ejsMate); //ejs-mate is just one of may engines that is used to run, parse or make sense of ejs and in this line, we're basically telling express that ejs-mate is the engine we want to use instead of the default one it's relying on.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



app.use(express.urlencoded({extended: true})); // --> parses the req.body
app.use(methodOverride("_method")); //-->after requiring, we pass in the string that we want to use for our query string ("_method")
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());


const secret = process.env.SECRET || "thisisnotabettersecret!";

// for us to use the mongostore that we just required

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24*60*60,
    crypto: {
        secret: "thisisnotabettersecret!"
    }

});

store.on("error", function(e) {
    console.log("Session Store Error", e);
})


// for us to use the mongostore that we just required

const sessionConfig = {
    store,
    name:"session",
    secret: "thisisnotabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
// ***************************************************************************helmet*************************************************************************//
app.use(helmet());


const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
    // "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
    // "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dfd4qkatg/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// ***************************************************************************helmet*************************************************************************//

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //-->this means we want passport.js to use the LocalStrategy(passport-local) that we have download and required, and for that LocalStrategy, the authentication method is gonna be located in our User model and it's called .authenticate. And yes, we don't have a method in our User model called authenticate. But, since we require passport-local-mongoose in our User model(user.js), one of the static methods that comes built in and added in automatically in our model is the .authenticate.

passport.serializeUser(User.serializeUser()); // --> this is telling passport how to serialize a user which means how do we store a user in the session.
passport.deserializeUser(User.deserializeUser()); //--> tells passport how to get the user out of that session.

// *****************************************************************************************************************************************//
// passport.use(new LocalStrategy(User.authenticate()));

// This line tells Passport.js to use the LocalStrategy for authentication. User.authenticate() is a method provided by the passport-local-mongoose plugin, which is used in the User model. It's a helper function that takes care of the actual authentication process (i.e., verifying if the email/username and password are correct).

// 2.

// passport.serializeUser(User.serializeUser());

// passport.deserializeUser(User.deserializeUser());

// When a user logs in, their session needs to be managed. The session is a place to store data that persists across multiple requests. Instead of storing the entire user object in the session, we store only the user's ID, as it is more efficient.

// serializeUser is a function that tells Passport.js how to save the user's ID into the session. User.serializeUser() is another helper function provided by the passport-local-mongoose plugin, which takes care of the serialization process.

// deserializeUser is the opposite of serializeUser. It tells Passport.js how to retrieve the user object from the database (that we store in the database based on the User model) using the ID stored in the session. User.deserializeUser() is a helper function provided by the passport-local-mongoose plugin, which takes care of the deserialization process.

// The "done" function mentioned in the Stack Overflow quote is an internal function used by Passport.js when it's processing the authentication. You don't see it directly in your app code here, but it is used in the background to indicate whether the authentication process was successful or not. The user ID is saved in the session so that deserializeUser can later retrieve the user object using that ID.

// In summary, these lines of code set up Passport.js to use the LocalStrategy for authentication and configure how the user's session will be managed (i.e., which data will be stored in the session and how to retrieve the user object from the database using the stored data).

// *****************************************************************************************************************************************//

// middleware for flash
app.use((req, res, next) => {
    // console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});








// we use our router from the campgrounds file that we just required and a path that we want our routers from the campgrounds.js that we want to prefix them with. then we go back to campgrounds.js and clean up all the routes that starts with "campgrounds" since we already declared our route prefix here.
app.use("/campgrounds", campgroundRoutes);


// same goes for our reviews
app.use("/campgrounds/:id/reviews", reviewRoutes);


app.use("/", userRoutes);







app.get("/", (req, res) => {
    res.render("home");
});




// **********************************this is where we start to use our ExpressError Class(ExpressError.js)*****************************//

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

// **********************************this is where we start to use our ExpressError Class(ExpressError.js)*****************************//

// *****************Error Handler***********************************************************************//

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = "Something went wrong..."
    res.status(statusCode).render("error", { err }); // --> this will render our error.ejs page

  
})


// ************************Delete Route**************************************************************//
app.listen(3000,() => {
    console.log("Connecting to Port3000...");
});














































// app.get("/makecampground", async (req, res) => {
//     const camp = new Campground({title: "Balay", price: 12, description:"bahay", location:"mindoro"})
//     await camp.save();
//     res.send(camp);
// })
