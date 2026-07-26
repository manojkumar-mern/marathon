import * as cloudinaryProvider from "./providers/cloudinary.provider.js";

const provider = cloudinaryProvider;

export const uploadImage = (file, options) => {
  return provider.uploadImage(file, options);
};

export const uploadMultipleImages = (files, options) => {
  return provider.uploadMultipleImages(files, options);
};

export const deleteImage = (publicId) => {
  return provider.deleteImage(publicId);
};

export const generateOptimizedUrl = (publicId, options) => {
  return provider.generateOptimizedUrl(publicId, options);
};
