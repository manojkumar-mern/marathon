import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import {
  createRegistrationValidation,
  updateRegistrationValidation,
  registrationIdParam,
} from "./registration.validation.js";
import * as registrationController from "./registration.controller.js";

const router = Router();

router.post(
  "/",
  authenticateUser,
  createRegistrationValidation,
  registrationController.create
);

router.get(
  "/me",
  authenticateUser,
  registrationController.getMyRegistrations
);

router.get(
  "/",
  authenticateUser,
  authorize("admin"),
  registrationController.list
);

router.get(
  "/:id",
  authenticateUser,
  registrationIdParam,
  registrationController.getById
);

router.patch(
  "/:id",
  authenticateUser,
  authorize("admin"),
  updateRegistrationValidation,
  registrationController.update
);

router.delete(
  "/:id",
  authenticateUser,
  authorize("admin"),
  registrationController.remove
);

export default router;
