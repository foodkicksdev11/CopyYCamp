
// ****we've created a folder called "routes" that will help in cleaning up the code in our app.js. In here we created a file called "campgrounds.js" and we're going to start by just requiring express

const express = require('express');

// then we declare our expressRouter and take out campground routes from app.js and put it in this file. Then all the "app" routes that we have here, we'll be replacing it with the word "router"

const router = express.Router({ mergeParams: true});

// import our index controller
const campgroundsCtr = require("../controllers/campgroundsCtr");


// After taking out "campgrounds", we require catchAsync
const catchAsync = require("../utils/catchAsync");

// require Multer
const multer  = require('multer')

const { storage } = require("../cloudinary");

const upload = multer({ storage });


// import isLoggedIn from middleware.js
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware"); //-->with the const { isLoggedIn } approach, we are destructuring the middleware, selecting the isLoggedIn method from the entire middleware object, and making it ready to use. In the other approach, we're saving to the isLoggedIn variable everything inside that object, not only the isLoggedIn method (this will make more sense when Colt adds more methods to this file), so you'd need another approach to use the isLoggedIn method, using the isLoggedIn.isLoggedIn syntax. 

const Campground = require("../models/campground");



router.route("/")
      .get(catchAsync(campgroundsCtr.index))
      .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgroundsCtr.createCampground));
    //   .post(upload.array("image"), (req, res) => {
    //     console.log(req.body, req.files);
    //     res.send("IT WORKED!")
    //   })


router.get("/new", isLoggedIn, campgroundsCtr.renderNewForm)

router.route("/:id")
      .get(catchAsync(campgroundsCtr.showCampground))
      .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgroundsCtr.updateCampground))
      .delete(isLoggedIn, isAuthor, catchAsync(campgroundsCtr.deleteCampground));





// ************************Index Route**************************************************************//


// ************************Index Route**************************************************************//




// ************************Create Route**************************************************************//



// ************************Create Route**************************************************************//





// ************************Show Route**************************************************************//



// ************************Show Route**************************************************************//


// ************************Edit/Update Route**************************************************************//
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundsCtr.renderEditForm));

// **After requiring and using methodOverride to pass in the query"_method", we can now use PUT, PATCH or DELETE

// ************************Edit/Update Route**************************************************************//


// ************************Delete Route**************************************************************//

// then we set module exports here to be "router" so we can reference it to app.js
module.exports = router;
