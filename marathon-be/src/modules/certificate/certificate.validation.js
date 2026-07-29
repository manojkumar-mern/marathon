import { body, param, query } from "express-validator";

export const createTemplateValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Template title is required"),

  body("htmlContent")
    .trim()
    .notEmpty()
    .withMessage("HTML content is required"),

  body("type")
    .trim()
    .isIn(["finisher", "participation", "winner", "volunteer", "organizer"])
    .withMessage("Type must be: finisher, participation, winner, volunteer, organizer"),
];

export const updateTemplateValidation = [
  param("id").isMongoId().withMessage("Invalid template ID"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Template title cannot be empty"),

  body("htmlContent")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("HTML content cannot be empty"),

  body("type")
    .optional()
    .trim()
    .isIn(["finisher", "participation", "winner", "volunteer", "organizer"])
    .withMessage("Type must be: finisher, participation, winner, volunteer, organizer"),
];

export const certIdParam = [
  param("id").isMongoId().withMessage("Invalid certificate ID"),
];

export const templateIdParam = [
  param("id").isMongoId().withMessage("Invalid template ID"),
];

export const registrationIdParam = [
  param("registrationId").isMongoId().withMessage("Invalid registration ID"),
];

export const certNumberParam = [
  param("certNumber")
    .trim()
    .notEmpty()
    .withMessage("Certificate number is required"),
];
