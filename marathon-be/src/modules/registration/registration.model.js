import mongoose from "mongoose";
import { branding } from "../../config/branding.js";

const runnerDetailsSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
  },
  { _id: false }
);

const emergencyContactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    relationship: { type: String, trim: true },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const medicalInfoSchema = new mongoose.Schema(
  {
    hasMedicalConditions: { type: Boolean, default: false },
    conditions: { type: String, trim: true },
    allergies: { type: String, trim: true },
    bloodGroup: { type: String, trim: true },
    emergencyMedication: { type: String, trim: true },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, min: 0 },
    currency: { type: String, default: "INR" },
    method: {
      type: String,
      enum: ["razorpay", "stripe", "offline"],
    },
    transactionId: { type: String, trim: true },
    paidAt: { type: Date },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
  },
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, unique: true, trim: true },
    bibNumber: { type: String, trim: true },
    marathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marathon",
      required: [true, "Marathon is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    raceCategory: {
      categoryId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true, trim: true },
      distance: { type: String, required: true, trim: true },
      price: { type: Number, required: true, min: 0 },
    },
    runnerDetails: { type: runnerDetailsSchema, required: true },
    emergencyContact: { type: emergencyContactSchema, required: true },
    tshirtSize: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    address: { type: addressSchema },
    medicalInfo: { type: medicalInfoSchema },
    payment: { type: paymentSchema },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "withdrawn"],
      default: "pending",
    },
    isCheckedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    qrCode: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

registrationSchema.index({ marathon: 1, user: 1, "raceCategory.categoryId": 1 }, { unique: true });
registrationSchema.index({ user: 1, createdAt: -1 });
registrationSchema.index({ marathon: 1, status: 1 });


registrationSchema.pre("validate", async function () {
  if (this.isNew && !this.registrationNumber) {
    const year = new Date().getFullYear();
    const prefix = branding.registrationPrefix;
    const count = await mongoose.model("Registration").countDocuments({
      registrationNumber: { $regex: `^${prefix}-${year}-` },
    });
    const seq = String(count + 1).padStart(5, "0");
    this.registrationNumber = `${prefix}-${year}-${seq}`;
  }
});

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;
