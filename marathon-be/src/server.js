import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";
import mongoose from "mongoose";

const start = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`🚀 Server running on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
      process.exit(0);
    });

    setTimeout(() => {
      console.error("Forced shutdown after timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};

start();
