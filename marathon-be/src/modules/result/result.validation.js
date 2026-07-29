import { body, param, query } from "express-validator";

export const createResultValidation = [
  body("registrationId")
    .isMongoId()
    .withMessage("Invalid registration ID"),

  body("gunTime")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Gun time must be a positive number"),

  body("chipTime")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Chip time must be a positive number"),

  body("status")
    .optional()
    .isIn(["finished", "dnf", "dns", "pending"])
    .withMessage("Status must be finished, dnf, dns, or pending"),
];

export const updateResultValidation = [
  param("id").isMongoId().withMessage("Invalid result ID"),

  body("gunTime")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Gun time must be a positive number"),

  body("chipTime")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Chip time must be a positive number"),

  body("status")
    .optional()
    .isIn(["finished", "dnf", "dns", "pending"])
    .withMessage("Status must be finished, dnf, dns, or pending"),
];

export const resultIdParam = [
  param("id").isMongoId().withMessage("Invalid result ID"),
];

export const marathonIdParam = [
  param("marathonId").isMongoId().withMessage("Invalid marathon ID"),
];

export const registrationIdParam = [
  param("registrationId").isMongoId().withMessage("Invalid registration ID"),
];
