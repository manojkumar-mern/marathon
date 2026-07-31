import mongoose from "mongoose";

const zohoSyncLogSchema = new mongoose.Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      unique: true,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
    },
    zohoContactId: {
      type: String,
      trim: true,
    },
    contactId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Updated"],
      default: "Pending",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    syncedAt: {
      type: Date,
    },
    error: {
      type: String,
      trim: true,
    },
    request: {
      type: mongoose.Schema.Types.Mixed,
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ZohoSyncLog = mongoose.model("ZohoSyncLog", zohoSyncLogSchema);
export default ZohoSyncLog;
