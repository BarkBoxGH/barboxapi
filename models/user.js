import { Schema } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";
import { PersonModel } from "./person.js";

// Define user schema

const userSchema = new Schema({
    favoriteBreed: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

userSchema.plugin(toJSON);

export const UserModel = PersonModel.discriminator ('User', userSchema);
