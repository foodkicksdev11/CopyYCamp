

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);   //--> (.plugin()) -->by adding or passing through passportLocalMongoose to .plugin, this is gonna add on to our schema a username, a field for password, it's going to make sure those usernames are unique and not duplicates and it'll also give us some methods we can use.

module.exports = mongoose.model("User", UserSchema);