import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      unique: true,
    },
    marathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marathon",
      required: true,
    },
    // Denormalised runner snapshot (so we don't need a populate chain on every list)
    registrationNumber: { type: String, trim: true },
    bibNumber: { type: String, trim: true },
    runnerDetails: {
      fullName: { type: String, trim: true },
      email: { type: String, trim: true },
    },
    raceCategory: {
      name: { type: String, trim: true },
      distance: { type: String, trim: true },
    },
    // Timing (seconds)
    gunTime: { type: Number, min: 0 },
    chipTime: { type: Number, min: 0 },
    // Rankings
    overallPosition: { type: Number, min: 1 },
    categoryPosition: { type: Number, min: 1 },
    genderPosition: { type: Number, min: 1 },
    // Status
    status: {
      type: String,
      enum: ["finished", "dnf", "dns", "pending"],
      default: "pending",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

resultSchema.index({ marathon: 1, overallPosition: 1 });
resultSchema.index({ marathon: 1, "raceCategory.name": 1, categoryPosition: 1 });
resultSchema.index({ registrationNumber: 1 });

const Result = mongoose.model("Result", resultSchema);

export default Result;
