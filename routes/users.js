

const express = require("express");

const router = express.Router();

const User = require("../models/user");

const catchAsync = require("../utils/catchAsync")

const passport = require("passport");

const { storeReturnTo } = require('../middleware');

const usersCtr = require("../controllers/usersCtr");




router.route("/register")
      .get(usersCtr.renderRegister)

      .post(catchAsync (usersCtr.register));



router.route("/login")
      .get(usersCtr.renderLogin)

      .post(storeReturnTo,
 passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), //-->passport.authenticate is a middleware provided to us by passportjs to help us authenticate. It's gonna expect us to specify the strategy("local", "facebook", "twitter", "google" and more...check docs) and then after that are options that we can specify thru object ({failureFlash: true, failureRedirect: "/login"}). failureFlash: true means it's just gonna flash a message autamatically. failureRedirect means if things go wrong, passport is going to redirect to the path that we specify     ("/login").
  usersCtr.login);















router.get('/logout', usersCtr.logout); 




module.exports = router;

// passport.authenticate() --> it expects us to specify the strategy "local" for it to authenticate requests.


// **********Explanation and function of res.locals.returnTo vs req.session.returnTo*************************by Zarko(Teaching Asst)**************//

// 1. req.session.returnTo: req.session is an object associated with the user's session. It allows you to store data that persists across multiple requests made by the same user. In this case, req.session.returnTo is used to store the URL of the page the user was trying to access before they were redirected to the login page. This value is set inside the isLoggedIn middleware function:

// module.exports.isLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         req.session.returnTo = req.originalUrl; // Storing the URL the user was trying to access
//         req.flash('error', 'You must be signed in first!');
//         return res.redirect('/login');
//     }
//     next();
// }
// 2. res.locals.returnTo: res.locals is an object provided by Express.js that allows you to store data that can be accessed by your templates and other middleware functions during the request-response cycle. In this case, res.locals.returnTo is used to store the URL the user should be redirected to after they have successfully logged in.

// Since Passport.js clears the session after a successful login, the value stored in req.session.returnTo will be lost. To prevent this from happening, a new middleware function storeReturnTo is created:

// module.exports.storeReturnTo = (req, res, next) => {
//     if (req.session.returnTo) {
//         res.locals.returnTo = req.session.returnTo; // Storing the returnTo value in res.locals
//     }
//     next();
// }
// This function checks if there's a returnTo value in req.session. If there is, it transfers that value to res.locals.returnTo before the session is cleared by Passport.js. This way, the returnTo value can still be accessed later in the middleware chain to redirect the user after a successful login:

//     req.flash('success', 'Welcome back!');
//     const redirectUrl = res.locals.returnTo || '/campgrounds'; // Using res.locals.returnTo to get the URL to redirect to
//     res.redirect(redirectUrl);
// In summary, req.session.returnTo is used to store the URL the user was trying to access before being redirected to the login page, while res.locals.returnTo is used to store that URL after the session is cleared by Passport.js. This allows you to still redirect the user back to the original page they were trying to visit after they have successfully logged in.


// **********Explanation and function of res.locals.returnTo vs req.session.returnTo*************************by Zarko(Teaching Asst)**************//