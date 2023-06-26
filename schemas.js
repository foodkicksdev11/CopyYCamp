
// require Joi after installing it. Joi is a schema validation. It lets you describe your data using a simple, intuitive, and readable language.

const BaseJoi = require("joi");

// require sanitize-html to use in conjunction with Joi and escapeHTML
const sanitizeHtml = require("sanitize-html");

// after requiring Joi, we can define our schema(not a mongoose Schema). This is a schema that will validate our data before we even attempt to save it with mongoose or involve mongoose at all in saving our data.

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages:{
        "string.escapeHTML": "{{#label}} must not include HTML!"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes:{},
                });
                if(clean !== value) return helpers.error("string.escapeHTML", {value})
                return clean;
            }
        }
    }

})


const Joi = BaseJoi.extend(extension);


module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()

    }).required(),  //-->now, once our schema(validation) is defined, all we do is pass our data through to the schema.
        deleteImages:Joi.array()
})

module.exports.reviewSchema = Joi.object ({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})