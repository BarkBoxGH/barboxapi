import { Schema, model }  from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

// Define schema for the person
const personSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user', 'vendor'],
    }
}, 
{
    timestamps: true
})

// Add toJSON plugin to the schema
personSchema.plugin(toJSON);

// create the model for the person
export const PersonModel = model('Person', personSchema);