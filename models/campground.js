

// require mongoose
const mongoose = require('mongoose');

// make a variable for the schema
const Schema = mongoose.Schema;

const Review = require("./review")

// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/test');
// }


// https://res.cloudinary.com/dfd4qkatg/image/upload/v1687245122/YCamp/rai9lph9swb1lqcz4cbt.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_300");
});

const opts = { toJSON: { virtuals: true } };

// start making schema
const CampgroundSchema = new Schema({

    title: String,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }
    ]


}, opts)


CampgroundSchema.virtual("properties.popUpMarkup").get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 30)}...</p>`
});

// ***********Delete Middleware**************************//

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in:doc.reviews
            }
        })
    }
})

// export the schema

module.exports = mongoose.model("Campground", CampgroundSchema) // --> "Campground" is the name of the model and "CampgroundSchema" is the name of our schema


