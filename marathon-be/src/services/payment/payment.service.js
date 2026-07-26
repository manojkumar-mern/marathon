import * as razorpayProvider from "./providers/razorpay.provider.js";

const provider = razorpayProvider;

export const createOrder = (options) => {
  return provider.createOrder(options);
};

export const verifyPayment = (data) => {
  return provider.verifyPayment(data);
};

export const verifyWebhookSignature = (body, signature) => {
  return provider.verifyWebhookSignature(body, signature);
};
