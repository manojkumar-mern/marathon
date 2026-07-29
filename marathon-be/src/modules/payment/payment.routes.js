import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import {
  createOrderValidation,
  verifyPaymentValidation,
  paymentIdParam,
} from "./payment.validation.js";
import * as paymentController from "./payment.controller.js";

const router = Router();

router.post(
  "/create-order",
  authenticateUser,
  createOrderValidation,
  paymentController.createOrder
);

router.post(
  "/verify",
  authenticateUser,
  verifyPaymentValidation,
  paymentController.verify
);

router.post(
  "/webhook",
  paymentController.handleWebhook
);

router.get(
  "/me",
  authenticateUser,
  paymentController.getMyPayments
);

router.get(
  "/:id",
  authenticateUser,
  paymentIdParam,
  paymentController.getById
);

router.get(
  "/",
  authenticateUser,
  authorize("admin"),
  paymentController.list
);

export default router;
