import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { personRouter } from "./routes/person.js";
import { bookingRouter } from "./routes/booking.js";

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

// Initialize Express app
const app = express();

// initialize cors  


// use middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// use routes
app.use('/person', personRouter);
app.use('/booking', bookingRouter);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
