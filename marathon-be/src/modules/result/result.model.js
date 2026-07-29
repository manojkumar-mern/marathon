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
    finishTime: { type: Number, min: 0 },
    netTime: { type: Number, min: 0 },
    // Rankings
    overallPosition: { type: Number, min: 1 },
    categoryPosition: { type: Number, min: 1 },
    genderPosition: { type: Number, min: 1 },
    overallRank: { type: Number, min: 1 },
    categoryRank: { type: Number, min: 1 },
    genderRank: { type: Number, min: 1 },
    // Status
    status: {
      type: String,
      enum: ["finished", "dnf", "dns", "pending"],
      default: "pending",
    },
    finishStatus: {
      type: String,
      enum: ["Completed", "DNF", "DNS", "Disqualified", "Pending"],
      default: "Pending",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
      default: null,
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

resultSchema.pre("save", function () {
  // Sync timing
  if (this.chipTime !== undefined && this.finishTime === undefined) {
    this.finishTime = this.chipTime;
  }
  if (this.finishTime !== undefined && this.chipTime === undefined) {
    this.chipTime = this.finishTime;
  }
  if (this.chipTime !== undefined && this.netTime === undefined) {
    this.netTime = this.chipTime;
  }
  if (this.netTime !== undefined && this.chipTime === undefined) {
    this.chipTime = this.netTime;
  }

  // Sync positions / ranks
  if (this.overallPosition !== undefined && this.overallRank === undefined) {
    this.overallRank = this.overallPosition;
  }
  if (this.overallRank !== undefined && this.overallPosition === undefined) {
    this.overallPosition = this.overallRank;
  }

  if (this.categoryPosition !== undefined && this.categoryRank === undefined) {
    this.categoryRank = this.categoryPosition;
  }
  if (this.categoryRank !== undefined && this.categoryPosition === undefined) {
    this.categoryPosition = this.categoryRank;
  }

  if (this.genderPosition !== undefined && this.genderRank === undefined) {
    this.genderRank = this.genderPosition;
  }
  if (this.genderRank !== undefined && this.genderPosition === undefined) {
    this.genderPosition = this.genderRank;
  }

  // Sync status
  if (this.status === "finished") {
    this.finishStatus = "Completed";
  } else if (this.status === "dnf") {
    this.finishStatus = "DNF";
  } else if (this.status === "dns") {
    this.finishStatus = "DNS";
  }

  if (this.finishStatus === "Completed") {
    this.status = "finished";
  } else if (this.finishStatus === "DNF") {
    this.status = "dnf";
  } else if (this.finishStatus === "DNS") {
    this.status = "dns";
  } else if (this.finishStatus === "Disqualified") {
    this.status = "dnf"; // mapping Disqualified to DNF for legacy status
  }
});

resultSchema.index({ marathon: 1, overallPosition: 1 });
resultSchema.index({ marathon: 1, "raceCategory.name": 1, categoryPosition: 1 });
resultSchema.index({ registrationNumber: 1 });

const Result = mongoose.model("Result", resultSchema);

export default Result;
