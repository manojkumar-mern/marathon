import { body, param } from "express-validator";

export const createOrderValidation = [
  body("registrationId")
    .isMongoId()
    .withMessage("Valid registration ID is required"),
];

export const verifyPaymentValidation = [
  body("registrationId")
    .isMongoId()
    .withMessage("Valid registration ID is required"),

  body("razorpay_order_id")
    .trim()
    .notEmpty()
    .withMessage("Razorpay order ID is required"),

  body("razorpay_payment_id")
    .trim()
    .notEmpty()
    .withMessage("Razorpay payment ID is required"),

  body("razorpay_signature")
    .trim()
    .notEmpty()
    .withMessage("Razorpay signature is required"),
];

export const paymentIdParam = [
  param("id").isMongoId().withMessage("Valid payment ID is required"),
];
