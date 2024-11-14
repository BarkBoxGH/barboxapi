import express from "express";
import mongoose from "mongoose";
import Cors from "cors";
import { personRouter } from "./routes/person.js";

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

// Initialize Express app
const app = express();

// use middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Cors());

// use routes
app.use('/person', personRouter);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
