import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    marathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marathon",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    gateway: {
      type: String,
      enum: ["razorpay", "stripe", "cashfree"],
      default: "razorpay",
    },
    gatewayOrderId: { type: String, trim: true },
    gatewayPaymentId: { type: String, trim: true },
    gatewaySignature: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "authorized", "paid", "failed", "cancelled", "refunded"],
      default: "pending",
    },
    method: { type: String, trim: true },
    receipt: { type: String, unique: true, trim: true },
    notes: { type: mongoose.Schema.Types.Mixed },
    paidAt: { type: Date },
    refundedAt: { type: Date },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ marathon: 1, status: 1 });
paymentSchema.index({ gatewayOrderId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
