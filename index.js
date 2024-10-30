import express from "express";
import mongoose from "mongoose";

// Initialize Express app
const app = express();

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
