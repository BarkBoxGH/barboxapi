import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

// Define schema for the pet profile
const petProfileSchema = new Schema({
  petOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User ', // Assuming you have a User model for pet owners
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  medicalHistory: {
    type: String
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add toJSON plugin to the schema
petProfileSchema.plugin(toJSON);

// Export the model
export const PetProfileModel = model('PetProfile', petProfileSchema);