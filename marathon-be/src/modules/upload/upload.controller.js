import { validationResult } from "express-validator";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import * as storageService from "../../services/storage/storage.service.js";
import { AppError } from "../../utils/AppError.js";

export const uploadImage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  if (!req.file) {
    throw new AppError("No image file provided", 400);
  }

  const result = await storageService.uploadImage(req.file, {
    folder: req.body.folder || "uploads",
  });

  return successResponse(res, {
    statusCode: 201,
    message: "Image uploaded successfully",
    data: result,
  });
});

export const uploadImages = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  if (!req.files || req.files.length === 0) {
    throw new AppError("No image files provided", 400);
  }

  const results = await storageService.uploadMultipleImages(req.files, {
    folder: req.body.folder || "uploads",
  });

  return successResponse(res, {
    statusCode: 201,
    message: `${results.length} image(s) uploaded successfully`,
    data: { images: results },
  });
});

export const deleteImage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  await storageService.deleteImage(req.params.publicId);

  return successResponse(res, {
    message: "Image deleted successfully",
  });
});
