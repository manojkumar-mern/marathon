import mongoose from "mongoose";

const zohoSyncLogSchema = new mongoose.Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      unique: true, // Ensuring one log per registration
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Updated"],
      default: "Pending",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    registrationIdString: {
      type: String,
      required: true,
      trim: true,
    },
    lastSyncAttempt: {
      type: Date,
      default: Date.now,
    },
    attemptsCount: {
      type: Number,
      default: 0,
    },
    errorDetails: {
      timestamp: { type: Date },
      endpoint: { type: String },
      httpStatus: { type: Number },
      errorMessage: { type: String },
    },
  },
  { timestamps: true }
);

const ZohoSyncLog = mongoose.model("ZohoSyncLog", zohoSyncLogSchema);
export default ZohoSyncLog;
