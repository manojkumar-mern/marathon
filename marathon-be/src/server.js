import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";
import mongoose from "mongoose";
import { autoSeed } from "./seed/auto-seed.js";
import { reminderScheduler } from "./services/reminder.service.js";
import { verifyConnection } from "./services/zoho.service.js";

// Handle uncaught exceptions and unhandled rejections early
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const start = async () => {
  await connectDB();
  try {
    await autoSeed();
  } catch (err) {
    console.warn("Auto-seed skipped:", err.message);
  }

  // Verify Zoho CRM connection on startup without crashing the server
  try {
    const zohoStatus = await verifyConnection();
    if (zohoStatus.connected) {
      console.log("✓ Zoho CRM Connected Successfully");
    } else {
      console.error("[Zoho CRM Startup Error] Connection verification failed:", zohoStatus.reason);
    }
  } catch (err) {
    console.error("[Zoho CRM Startup Error] Failed to execute verification:", err.message);
  }

  const server = app.listen(env.port, () => {
    console.log(`🚀 Server running on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  // Start periodic reminder processing every hour (Missing automation triggers)
  const reminderInterval = setInterval(() => {
    reminderScheduler.processReminders().catch((err) => {
      console.error("Error processing reminders in scheduled trigger:", err);
    });
  }, 60 * 60 * 1000);

  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    
    // Clear scheduled reminder interval (Timeout/Interval cleanup)
    clearInterval(reminderInterval);

    const shutdownTimeout = setTimeout(() => {
      console.error("Forced shutdown after timeout.");
      process.exit(1);
    }, 10000);

    server.close(async () => {
      clearTimeout(shutdownTimeout); // Clear timeout when closed successfully
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};

start().catch((err) => {
  console.error("Critical: Server failed to start:", err);
  process.exit(1);
});
