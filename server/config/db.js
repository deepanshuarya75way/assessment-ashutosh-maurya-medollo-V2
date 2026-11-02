// config/db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
  try {
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
