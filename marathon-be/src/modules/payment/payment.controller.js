import { validationResult } from "express-validator";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import * as paymentService from "./payment.service.js";

export const createOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const result = await paymentService.createPaymentOrder(
    req.user._id,
    req.body.registrationId
  );

  return successResponse(res, {
    statusCode: 201,
    message: "Payment order created successfully",
    data: result,
  });
});

export const verify = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const result = await paymentService.verifyPayment(req.user._id, req.body);

  return successResponse(res, {
    message: "Payment verified successfully",
    data: result,
  });
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const payment = await paymentService.getPaymentById(
    req.user._id,
    req.user.role,
    req.params.id
  );

  return successResponse(res, {
    message: "Payment retrieved successfully",
    data: { payment },
  });
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const result = await paymentService.getUserPayments(req.user._id, req.query);

  return successResponse(res, {
    message: "Payments retrieved successfully",
    data: result,
  });
});

export const list = asyncHandler(async (req, res) => {
  const result = await paymentService.getAllPayments(req.query);

  return successResponse(res, {
    message: "Payments retrieved successfully",
    data: result,
  });
});

export const handleWebhook = asyncHandler(async (req, res) => {
  const rawBody = req.rawBody || JSON.stringify(req.body);
  const signature = req.headers["x-razorpay-signature"];
  const event = req.body?.event;

  const result = await paymentService.handleWebhook(rawBody, signature, event);

  return successResponse(res, {
    message: "Webhook processed successfully",
    data: result,
  });
});
