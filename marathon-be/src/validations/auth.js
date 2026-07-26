import { body } from "express-validator";

const phoneRegex = /^[6-9]\d{9}$/;

export const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),

  body("phone")
    .trim()
    .matches(phoneRegex)
    .withMessage("Valid 10-digit Indian phone number is required"),
];

export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];
