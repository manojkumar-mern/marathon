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
    },
    marathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marathon",
      required: true,
    },
    type: {
      type: String,
      enum: ["participation", "finisher", "winner", "volunteer", "organizer"],
      required: true,
      default: "finisher",
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CertificateTemplate",
    },
    result: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Result",
      default: null,
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
      enum: ["pending", "generated", "downloaded", "emailed", "revoked"],
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

// Compound unique index to prevent duplicate certificates of the same type for a registration
certificateSchema.index({ registration: 1, type: 1 }, { unique: true });
certificateSchema.index({ marathon: 1 });

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
