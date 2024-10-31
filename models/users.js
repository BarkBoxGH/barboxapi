import { Schema, model }  from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

// Define schema for the user
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, 
{
    timestamps: true
})

// Add toJSON plugin to the schema
userSchema.plugin(toJSON);

// create the model for the user
export const UserModel = model('User', userSchema);