import { body, param, query } from "express-validator";
import { PHONE_REGEX } from "../../constants/regex.js";

const urlRegex = /^https?:\/\/.+/;

export const createMarathonValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Marathon title is required"),

  body("eventDate")
    .isISO8601()
    .withMessage("Valid event date is required"),

  body("registrationStartDate")
    .isISO8601()
    .withMessage("Valid registration start date is required"),

  body("registrationEndDate")
    .isISO8601()
    .withMessage("Valid registration end date is required"),

  body("venue.name")
    .trim()
    .notEmpty()
    .withMessage("Venue name is required"),

  body("venue.city")
    .trim()
    .notEmpty()
    .withMessage("Venue city is required"),

  body("venue.state")
    .trim()
    .notEmpty()
    .withMessage("Venue state is required"),

  body("contactEmail")
    .optional()
    .isEmail()
    .withMessage("Valid contact email is required")
    .normalizeEmail(),

  body("contactPhone")
    .optional()
    .matches(PHONE_REGEX)
    .withMessage("Valid 10-digit Indian phone number is required"),

  body("bannerImage")
    .optional()
    .matches(urlRegex)
    .withMessage("Banner image must be a valid URL"),

  body("status")
    .optional()
    .isIn(["draft", "published", "completed", "cancelled"])
    .withMessage("Status must be one of: draft, published, completed, cancelled"),

  body("raceCategories.*.name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Race category name is required"),

  body("raceCategories.*.distance")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Race category distance is required"),

  body("raceCategories.*.difficulty")
    .optional()
    .isIn(["easy", "moderate", "hard", "extreme"])
    .withMessage("Difficulty must be: easy, moderate, hard, or extreme"),

  body("raceCategories.*.price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("raceCategories.*.maxParticipants")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max participants must be at least 1"),

  body("raceCategories.*.startTime")
    .optional()
    .notEmpty()
    .withMessage("Race category start time is required"),
];

export const updateMarathonValidation = [
  param("id").isMongoId().withMessage("Invalid marathon ID"),
];

export const marathonSlugParam = [
  param("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required"),
];

export const marathonIdParam = [
  param("id").isMongoId().withMessage("Invalid marathon ID"),
];

export const listMarathonsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
