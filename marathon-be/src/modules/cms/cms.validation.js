import { body, param } from "express-validator";

export const createPageValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Page title is required"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Page slug is required")
    .isLowercase()
    .withMessage("Slug must be lowercase"),
];

export const updatePageValidation = [
  param("id").isMongoId().withMessage("Invalid page ID"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Page title cannot be empty"),

  body("slug")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Page slug cannot be empty")
    .isLowercase()
    .withMessage("Slug must be lowercase"),
];

export const createAnnouncementValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Announcement title is required"),
];

export const updateAnnouncementValidation = [
  param("id").isMongoId().withMessage("Invalid announcement ID"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Announcement title cannot be empty"),
];

export const pageIdParam = [
  param("id").isMongoId().withMessage("Invalid page ID"),
];

export const announcementIdParam = [
  param("id").isMongoId().withMessage("Invalid announcement ID"),
];
