import { Schema } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";
import { PersonModel } from "./person.js";

// Define schema for the vendor

const vendorSchema = new Schema({
    storeName: {
        type: String,
        required: true,
        trim:  true
    },
    storeDescription: {
        type: String,
        required: true,
        trim: true
    },
    storeLocation: {
        type: String,
        required: true,
        trim: true
    },
    storeContact: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

vendorSchema.plugin(toJSON);

// export vendor model
export const VendorModel = PersonModel.discriminator( 'vendor', vendorSchema );