import { body, param, query } from "express-validator";
import { PHONE_REGEX } from "../../constants/regex.js";

const tshirtSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export const createRegistrationValidation = [
  body("marathon")
    .trim()
    .notEmpty()
    .withMessage("Marathon ID is required"),

  body("raceCategoryId")
    .trim()
    .notEmpty()
    .withMessage("Race category ID is required"),

  body("runnerDetails.fullName")
    .trim()
    .notEmpty()
    .withMessage("Runner full name is required"),

  body("runnerDetails.email")
    .trim()
    .isEmail()
    .withMessage("Valid runner email is required")
    .normalizeEmail(),

  body("runnerDetails.phone")
    .trim()
    .matches(PHONE_REGEX)
    .withMessage("Valid 10-digit Indian phone number is required for runner"),

  body("emergencyContact.fullName")
    .trim()
    .notEmpty()
    .withMessage("Emergency contact name is required"),

  body("emergencyContact.phone")
    .trim()
    .matches(PHONE_REGEX)
    .withMessage("Valid 10-digit Indian phone number is required for emergency contact"),

  body("tshirtSize")
    .optional()
    .isIn(tshirtSizes)
    .withMessage(`T-shirt size must be one of: ${tshirtSizes.join(", ")}`),

  body("address.city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City is required if address is provided"),

  body("address.state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State is required if address is provided"),
];

export const updateRegistrationValidation = [
  param("id").isMongoId().withMessage("Invalid registration ID"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "cancelled", "withdrawn"])
    .withMessage("Status must be one of: pending, confirmed, cancelled, withdrawn"),

  body("bibNumber")
    .optional()
    .trim(),

  body("isCheckedIn")
    .optional()
    .isBoolean()
    .withMessage("isCheckedIn must be a boolean"),

  body("isCompleted")
    .optional()
    .isBoolean()
    .withMessage("isCompleted must be a boolean"),
];

export const registrationIdParam = [
  param("id").isMongoId().withMessage("Invalid registration ID"),
];
