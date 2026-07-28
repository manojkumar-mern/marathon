import mongoose from "mongoose";

const reminderLogSchema = new mongoose.Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },
    marathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marathon",
      required: true,
    },
    reminderType: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },
    channels: [String],
    error: String,
  },
  { timestamps: true }
);

// Prevent duplicate notifications by adding a compound unique index
reminderLogSchema.index({ registration: 1, reminderType: 1 }, { unique: true });

const ReminderLog = mongoose.model("ReminderLog", reminderLogSchema);
export default ReminderLog;
