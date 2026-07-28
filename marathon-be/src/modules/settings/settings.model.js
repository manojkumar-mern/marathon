import mongoose from "mongoose";

// Singleton settings document — only one doc ever exists, identified by key="global"
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },
    general: {
      brandName: { type: String, default: "STRIDEFORGE" },
      shortName: { type: String, default: "SF" },
      tagline: { type: String, default: "" },
      supportEmail: { type: String, default: "" },
      supportPhone: { type: String, default: "" },
      address: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    registration: {
      enableGroupRegistration: { type: Boolean, default: true },
      enableWaiver: { type: Boolean, default: true },
      waiverText: { type: String, default: "" },
      minAge: { type: Number, default: 5 },
      maxAge: { type: Number, default: 100 },
      termsUrl: { type: String, default: "" },
      privacyUrl: { type: String, default: "" },
      enableRefund: { type: Boolean, default: false },
      refundPolicy: { type: String, default: "" },
      cancellationDeadlineDays: { type: Number, default: 7 },
    },
    payments: {
      currency: { type: String, default: "INR" },
      gateway: { type: String, default: "razorpay" },
      enableTestMode: { type: Boolean, default: true },
      convenienceFee: { type: Number, default: 0 },
      convenienceFeeType: { type: String, enum: ["percentage", "flat"], default: "percentage" },
    },
    email: {
      provider: { type: String, default: "smtp" },
      smtpHost: { type: String, default: "" },
      smtpPort: { type: Number, default: 587 },
      smtpUser: { type: String, default: "" },
      fromEmail: { type: String, default: "" },
      fromName: { type: String, default: "" },
      enableEmailNotifications: { type: Boolean, default: true },
    },
    social: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
