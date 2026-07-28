import mongoose from "mongoose";

let counter = 0;
const generateCertNumber = () => {
  counter++;
  const ts = Date.now().toString(36).toUpperCase();
  return `CERT-${ts}-${String(counter).padStart(4, "0")}`;
};

const certificateSchema = new mongoose.Schema(
  {
    certificateNumber: {
      type: String,
      unique: true,
      trim: true,
    },
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
    // Denormalised snapshot
    participant: {
      fullName: { type: String, trim: true },
      email: { type: String, trim: true },
    },
    raceCategory: {
      name: { type: String, trim: true },
      distance: { type: String, trim: true },
    },
    bibNumber: { type: String, trim: true },
    finishTime: { type: Number }, // seconds
    eventDate: { type: Date },
    // Certificate assets
    certificateUrl: { type: String, trim: true },
    qrCode: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "generated", "downloaded", "emailed"],
      default: "pending",
    },
    generatedAt: { type: Date },
    emailedAt: { type: Date },
  },
  { timestamps: true }
);

certificateSchema.pre("validate", function () {
  if (this.isNew && !this.certificateNumber) {
    this.certificateNumber = generateCertNumber();
  }
});

certificateSchema.index({ marathon: 1 });

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
