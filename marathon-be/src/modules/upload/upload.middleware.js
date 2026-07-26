import multer from "multer";
import { AppError } from "../../utils/AppError.js";
import { env } from "../../config/env.js";
import { ALLOWED_MIME_TYPES } from "../../services/storage/storage.constants.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`Unsupported file type: ${file.mimetype}`, 400), false);
  }
};

const maxSize = env.uploadMaxFileSize;

export const uploadSingle = multer({ storage, fileFilter, limits: { fileSize: maxSize } }).single("image");

export const uploadMultiple = multer({ storage, fileFilter, limits: { fileSize: maxSize } }).array("images", 10);
