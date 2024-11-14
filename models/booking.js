import { Schema, model } from "mongoose"
import { toJSON } from "@reis/mongoose-to-json";

const bookingSchema = new Schema({
  service: {
    type: String,
    required: true,
    enum: ['veterinary', 'grooming', 'training']
  },
  petOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pet: {
    type: Schema.Types.ObjectId,
    ref: 'PetProfile',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add toJSON plugin to the schema
bookingSchema.plugin(toJSON);

// Export the model
export const BookingModel = model('Booking', bookingSchema)


