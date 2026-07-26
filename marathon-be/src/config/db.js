import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB Connected Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️  MongoDB Disconnected");
  });

  try {
    await mongoose.connect(env.mongoUri);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
