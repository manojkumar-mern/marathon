import Registration from "../registration/registration.model.js";
import Marathon from "../marathon/marathon.model.js";
import Payment from "../../models/Payment.js";
import * as paymentProvider from "../../services/payment/payment.service.js";
import { AppError } from "../../utils/AppError.js";
import { env } from "../../config/env.js";
import {
  PAYMENT_STATUS,
  REGISTRATION_PAYMENT_STATUS,
} from "../../services/payment/payment.constants.js";

const generateReceipt = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP-${ts}${rand}`;
};

export const createPaymentOrder = async (userId, registrationId) => {
  const registration = await Registration.findById(registrationId)
    .populate("marathon", "title")
    .lean();

  if (!registration) {
    throw new AppError("Registration not found", 404);
  }

  if (registration.user.toString() !== userId.toString()) {
    throw new AppError("You do not own this registration", 403);
  }

  if (registration.status !== "pending") {
    throw new AppError("Registration is not in a pending state", 400);
  }

  if (registration.payment?.status === "completed") {
    throw new AppError("Payment already completed for this registration", 400);
  }

  const existingPayment = await Payment.findOne({
    registration: registrationId,
    status: { $in: ["pending", "paid"] },
  });

  if (existingPayment && existingPayment.status === "paid") {
    throw new AppError("Payment already completed for this registration", 400);
  }

  const receipt = generateReceipt();
  const amount = registration.raceCategory.price;
  const currency = registration.payment?.currency || "INR";

  let orderData;
  if (existingPayment?.gatewayOrderId) {
    orderData = {
      orderId: existingPayment.gatewayOrderId,
      amount: Math.round(amount * 100),
      currency,
      receipt,
    };
  } else {
    orderData = await paymentProvider.createOrder({
      amount,
      currency,
      receipt,
      notes: {
        registrationId: registration._id.toString(),
        userId: userId.toString(),
        marathonTitle: registration.marathon?.title,
      },
    });

    if (existingPayment) {
      existingPayment.gatewayOrderId = orderData.orderId;
      existingPayment.receipt = receipt;
      existingPayment.amount = amount;
      await existingPayment.save();
    } else {
      await Payment.create({
        registration: registrationId,
        user: userId,
        marathon: registration.marathon._id,
        amount,
        currency,
        gateway: "razorpay",
        gatewayOrderId: orderData.orderId,
        receipt,
        status: PAYMENT_STATUS.PENDING,
      });
    }
  }

  return {
    key: env.razorpayKeyId,
    orderId: orderData.orderId,
    amount: orderData.amount,
    currency: orderData.currency,
    receipt: orderData.receipt,
    registrationId,
    userName: registration.runnerDetails.fullName,
    userEmail: registration.runnerDetails.email,
    userPhone: registration.runnerDetails.phone,
  };
};

export const verifyPayment = async (userId, data) => {
  const { registrationId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  const registration = await Registration.findById(registrationId);
  if (!registration) {
    throw new AppError("Registration not found", 404);
  }

  if (registration.user.toString() !== userId.toString()) {
    throw new AppError("You do not own this registration", 403);
  }

  if (registration.status === "confirmed") {
    throw new AppError("Registration is already confirmed", 400);
  }

  const payment = await Payment.findOne({
    registration: registrationId,
    gatewayOrderId: razorpay_order_id,
  });

  if (!payment) {
    throw new AppError("Payment record not found", 404);
  }

  if (payment.status === PAYMENT_STATUS.PAID) {
    throw new AppError("Payment already verified", 400);
  }

  const isValid = paymentProvider.verifyPayment({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValid) {
    payment.status = PAYMENT_STATUS.FAILED;
    payment.gatewayPaymentId = razorpay_payment_id;
    payment.gatewaySignature = razorpay_signature;
    await payment.save();

    throw new AppError("Payment verification failed — invalid signature", 400);
  }

  payment.status = PAYMENT_STATUS.PAID;
  payment.gatewayPaymentId = razorpay_payment_id;
  payment.gatewaySignature = razorpay_signature;
  payment.paidAt = new Date();
  await payment.save();

  registration.status = "confirmed";
  registration.payment = {
    amount: payment.amount,
    currency: payment.currency,
    method: "razorpay",
    transactionId: razorpay_payment_id,
    paidAt: payment.paidAt,
    status: REGISTRATION_PAYMENT_STATUS.COMPLETED,
  };
  await registration.save();

  return {
    paymentId: payment._id,
    registrationId: registration._id,
    registrationNumber: registration.registrationNumber,
    amount: payment.amount,
    currency: payment.currency,
    gatewayPaymentId: razorpay_payment_id,
    status: PAYMENT_STATUS.PAID,
  };
};

export const handleWebhook = async (rawBody, signature, event) => {
  const isValid = paymentProvider.verifyWebhookSignature(rawBody, signature);

  if (!isValid) {
    throw new AppError("Invalid webhook signature", 401);
  }

  if (!event) {
    return { received: true };
  }

  const payload = JSON.parse(rawBody);

  if (event === "payment.captured" || event === "payment.paid") {
    const gatewayPaymentId = payload.payload?.payment?.entity?.id;
    const gatewayOrderId = payload.payload?.payment?.entity?.order_id;

    if (!gatewayPaymentId || !gatewayOrderId) {
      return { received: true };
    }

    const payment = await Payment.findOne({ gatewayOrderId });

    if (payment && payment.status === PAYMENT_STATUS.PENDING) {
      const registration = await Registration.findById(payment.registration);

      if (registration && registration.status !== "confirmed") {
        payment.status = PAYMENT_STATUS.PAID;
        payment.gatewayPaymentId = gatewayPaymentId;
        payment.paidAt = new Date();
        await payment.save();

        registration.status = "confirmed";
        registration.payment = {
          amount: payment.amount,
          currency: payment.currency,
          method: "razorpay",
          transactionId: gatewayPaymentId,
          paidAt: payment.paidAt,
          status: REGISTRATION_PAYMENT_STATUS.COMPLETED,
        };
        await registration.save();
      }
    }
  }

  if (event === "payment.failed") {
    const gatewayOrderId = payload.payload?.payment?.entity?.order_id;
    if (gatewayOrderId) {
      await Payment.findOneAndUpdate(
        { gatewayOrderId, status: PAYMENT_STATUS.PENDING },
        { status: PAYMENT_STATUS.FAILED }
      );
    }
  }

  return { received: true };
};

export const getPaymentById = async (userId, userRole, paymentId) => {
  const payment = await Payment.findById(paymentId)
    .populate("registration", "registrationNumber status")
    .populate("marathon", "title slug")
    .populate("user", "fullName email");

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (userRole !== "admin" && payment.user._id.toString() !== userId.toString()) {
    throw new AppError("You do not have permission to view this payment", 403);
  }

  return payment;
};

export const getUserPayments = async (userId, query) => {
  const { page = 1, limit = 10, sort = "-createdAt" } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [payments, total] = await Promise.all([
    Payment.find({ user: userId })
      .populate("registration", "registrationNumber status")
      .populate("marathon", "title slug")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Payment.countDocuments({ user: userId }),
  ]);

  return {
    payments,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
};

export const getAllPayments = async (query) => {
  const {
    page = 1,
    limit = 10,
    status,
    gateway,
    marathon,
    sort = "-createdAt",
  } = query;

  const filter = {};
  if (status) filter.status = status;
  if (gateway) filter.gateway = gateway;
  if (marathon) filter.marathon = marathon;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate("registration", "registrationNumber status")
      .populate("marathon", "title slug")
      .populate("user", "fullName email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Payment.countDocuments(filter),
  ]);

  return {
    payments,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
};
