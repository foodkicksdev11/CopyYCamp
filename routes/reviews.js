

const express = require('express');

const router = express.Router({ mergeParams: true});

// *****************************************************************************************************************************************//

const ExpressError = require("../utils/ExpressError");

const catchAsync = require("../utils/catchAsync");

// *****************************************************************************************************************************************//
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const Campground = require("../models/campground");

const Review = require("../models/review");

// import reviewsCtr - reviewsController
const reviewsCtr = require("../controllers/reviewsCtr");

// *****************************************************************************************************************************************//

const { reviewSchema } = require("../schemas.js")




// *****this is to associate the reviews for a specific campground*************************************//

router.post("/", isLoggedIn, validateReview, catchAsync(reviewsCtr.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewsCtr.deleteReview));


module.exports = router;