import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import {
  uploadImageValidation,
  uploadImagesValidation,
  deleteImageValidation,
} from "./upload.validation.js";
import {
  uploadSingle,
  uploadMultiple,
} from "./upload.middleware.js";
import * as uploadController from "./upload.controller.js";

const router = Router();

router.use(authenticateUser, authorize("admin"));

router.post(
  "/image",
  uploadSingle,
  uploadImageValidation,
  uploadController.uploadImage
);

router.post(
  "/images",
  uploadMultiple,
  uploadImagesValidation,
  uploadController.uploadImages
);

router.delete(
  "/:publicId",
  deleteImageValidation,
  uploadController.deleteImage
);

export default router;
