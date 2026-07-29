import mongoose from "mongoose";

const automationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["webhook", "notification", "scheduler", "custom"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lastExecutedAt: {
      type: Date,
    },
    successCount: {
      type: Number,
      default: 0,
    },
    failureCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const automationLogSchema = new mongoose.Schema(
  {
    automation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Automation",
      required: true,
    },
    eventName: {
      type: String,
      trim: true,
    },
    automationType: {
      type: String,
      trim: true,
    },
    executionTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },
    errorMessage: {
      type: String,
      trim: true,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    processingDuration: {
      type: Number, // duration in milliseconds
      default: 0,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

automationLogSchema.index({ eventName: 1 });
automationLogSchema.index({ executionTime: -1 });
automationLogSchema.index({ status: 1 });

export const Automation = mongoose.model("Automation", automationSchema);
export const AutomationLog = mongoose.model("AutomationLog", automationLogSchema);

/**
 * Registers or updates an automation in the database.
 * Designed so future automations can self-register on startup.
 */
export const registerAutomation = async (details) => {
  try {
    return await Automation.findOneAndUpdate(
      { name: details.name },
      { $setOnInsert: { status: "active" }, ...details },
      { upsert: true, new: true, runValidators: true }
    );
  } catch (err) {
    console.error(`[AutomationRegistry] Failed to register automation "${details.name}":`, err.message);
  }
};
