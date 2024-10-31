import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json"
 
// Define the schema for the dog listing
const dogListingSchema = new Schema({
    breed: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
}
);
// Add the toJSON plugin to the schema
dogListingSchema.plugin(toJSON);
// Create the model for the dog listing
export const DogListingModel = model ("DogListing", dogListingSchema)