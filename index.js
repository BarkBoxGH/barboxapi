import express from "express";
import mongoose from "mongoose";

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

// Initialize Express app
const app = express();

// use middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
