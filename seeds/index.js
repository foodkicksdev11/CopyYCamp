

// require mongoose
const mongoose = require("mongoose");

// import the cities.js
const cities = require("./cities");

// import places and descriptors from seedHelpers.js and deconstruct it.
const{ places, descriptors } = require("./seedHelpers");

const Campground = require("../models/campground"); //-->in here you have to backup one notch("../models" instead of "./models") so it can access index.js from Ycamp.

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
  console.log("connected");
}

// *To pick a random element from an array,

const sample = array => array[Math.floor(Math.random()*array.length)];



const seedDB = async() => {
    await Campground.deleteMany({}); // --> When we run seeDB(), we start by deleting everything, then
    for(let i =0; i<300; i++) { // 50 times we pick a random number to get a city with a city name and city state
       const random1000 =  Math.floor(Math.random()*1000);
       const price = Math.floor(Math.random()*50) + 20;
      const camp = new Campground ({
        author: "648c9efa8889a263a8beb149",
        location: `${cities[random1000].city}, ${cities[random1000].state}`, //-->we set that to our location
        title:`${sample(descriptors)} ${sample(places)}`,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae ipsum aliquam rerum atque reprehenderit sapiente eos similique, autem aut nemo repellendus sit non fuga neque optio beatae ipsa. Fugiat, vero.Voluptatum fugiat iure minus quaerat omnis qui, amet, dicta accusamus laboriosam facilis doloremque incidunt ullam repellat veniam culpa placeat! Rerum itaque eos officia dolor quisquam ipsum, libero voluptates numquam adipisci!Suscipit officia enim, quisquam ullam placeat quis iste cum saepe distinctio. Recusandae mollitia voluptates tempore accusamus quas consequatur magnam? Culpa maxime dolore illum quaerat voluptates veritatis voluptatum magnam sapiente cum?",
        price,

        geometry: { 
          type: 'Point',
          coordinates: [
            cities[random1000].longitude,
            cities[random1000].latitude
          ]
       },

        images:  [
          {
            url: 'https://res.cloudinary.com/dfd4qkatg/image/upload/v1687245120/YCamp/tyryv1uswkicwgxrtbzs.jpg',
            filename: 'YCamp/tyryv1uswkicwgxrtbzs',
           
          },
          {
            url: 'https://res.cloudinary.com/dfd4qkatg/image/upload/v1687245122/YCamp/rai9lph9swb1lqcz4cbt.jpg',
            filename: 'YCamp/rai9lph9swb1lqcz4cbt',
            
          }
        ],
      
       });

       await camp.save();

    }
}
seedDB().then(() => {//--> seedDB() returns a promise since it's an async function. So to close it when we're done populating data, we just run the code below  
    
    mongoose.connection.close();
})  

