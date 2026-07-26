import { body, param } from "express-validator";
import { ALLOWED_EXTENSIONS } from "../../services/storage/storage.constants.js";

export const uploadImageValidation = [
  body("folder")
    .optional()
    .trim()
    .isString()
    .withMessage("Folder must be a string"),
];

export const uploadImagesValidation = [
  body("folder")
    .optional()
    .trim()
    .isString()
    .withMessage("Folder must be a string"),
];

export const deleteImageValidation = [
  param("publicId")
    .trim()
    .notEmpty()
    .withMessage("Public ID is required"),
];
