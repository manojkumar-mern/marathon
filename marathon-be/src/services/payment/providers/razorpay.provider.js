import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "../../../config/env.js";

let instance = null;

const getInstance = () => {
  if (!instance) {
    instance = new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret,
    });
  }
  return instance;
};

export const createOrder = async ({ amount, currency, receipt, notes }) => {
  const order = await getInstance().orders.create({
    amount: Math.round(amount * 100),
    currency: currency || "INR",
    receipt,
    notes,
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
  };
};

export const verifyPayment = ({ orderId, paymentId, signature }) => {
  const expected = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expected === signature;
};

export const verifyWebhookSignature = (body, signature) => {
  const expected = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(body)
    .digest("hex");

  return expected === signature;
};
