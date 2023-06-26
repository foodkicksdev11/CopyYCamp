

const Campground = require("../models/campground");

// for geocoding
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// require mapbox token
const mapBoxToken = process.env.MAPBOX_TOKEN;

// instantiate new geocoding instance
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}


module.exports.renderNewForm =  (req, res) =>{
     res.render("campgrounds/new")
}

module.exports.createCampground = async(req, res, next) => { // --> this is the endpoint where the form is submitted to.
     
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    
    // res.send("ok!");

        const campground = new Campground(req.body.campground); //-->now, we're going to take that req.body, parsed it (app.use(express.urlencoded({extended: true}))), create a variable (campground) for the new campground and then save and await it (campground.save()), and the redirect it to the newly created campground(res.redirect(`/campgrounds/${campground._id})`)

   // on the req that we passed in the async function, we now have access to req.files and that is because of multer which parses the url of the images that we upload. So since req.files is an an array, what we need to do is to loop over those files and for each one of them, we want to take the path and filename and add them in our new Campground. And we can achieve that with the use of .map.

        campground.geometry = geoData.body.features[0].geometry;

        campground.images = req.files.map(f=>({url: f.path, filename: f.filename}))

        // ***since we already know that there is a current user(isLoggedIn middleware), we can associate the Campground that we're making with the logged in user which we can extract from req.user object(in the routes) and in our templates we have access to the local variable we set up called currentUser. So we can take the user._id from the req.user object and save it as the author of the new Campground.
        campground.author = req.user._id;
        await campground.save();
        console.log(campground);
        req.flash("success", "Successfully made a new campground");
        res.redirect(`/campgrounds/${ campground._id }`);


}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:"reviews",
        populate: {
            path: "author"
           }
        }).populate("author");
    if(!campground) {
        req.flash("error", "Campground Not Found");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {campground});

}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash("error", "Campground Not Found");
        return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", {campground});
}

module.exports.updateCampground = async(req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id,{ ...req.body.campground}) //--> the req.body.campground is the data that we want to update and we're passing that to Campground.findByIdAndUpdate(one of the methods we can use from our Campground model), await it and save that in a variable(campground)
    const imgs = req.files.map(f=>({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    if(req.body.deleteImages) {

        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }

        
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages} } } });
        console.log(campground);
    }


    await campground.save()
    req.flash("success", "Updated Campground!!!")
    res.redirect(`/campgrounds/${ campground._id }`); // --> then redirect it to the show page of the updated campground
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground deleted...")
    res.redirect("/campgrounds")
}