
// require our schemas.js destructured
const { campgroundSchema, reviewSchema } = require("./schemas.js");

const ExpressError = require("./utils/ExpressError");

const Campground = require("./models/campground");

const Review = require("./models/review");


module.exports.isLoggedIn = ( req, res, next ) => {

    if(!req.isAuthenticated()) { //--> Basically, this function (.isAuthenticated) checks if the user is successfully logged in; if it is, then it returns true, otherwise, it returns false.


        // ****if the user is not authenticated, we can store the URL they are requesting,
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in");
        return res.redirect("/login");
    
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.validateCampground = (req, res, next) =>{

    const { error }= campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el=>el.message).join(",")
        throw new ExpressError( msg, 400 )
    }else {
        next();
    }
   
} //--> now to add our JOI middleware in to our route handlers, we just add it as an argument before catchAsync and that's what we're going to do for our app.post in our CREATE route and in our app.put in our EDIT/UPDATE route. And we need to call in next for us to make it to our route handler


module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;  //we destructure the id from req.params.id so we can use it to find the specific campground
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to Edit or Update");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}




//*** we define our JOI middleware function */


module.exports.validateReview = (req, res, next) =>{

    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el=>el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;  //we destructure the id from req.params.id so we can use it to find the specific campground
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to Edit or Update");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

