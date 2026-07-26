import cloudinary from "../../../config/cloudinary.js";
import { Readable } from "stream";

const uploadStream = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    Readable.from(buffer).pipe(stream);
  });
};

export const uploadImage = async (file, { folder, publicId } = {}) => {
  const result = await uploadStream(file.buffer, {
    folder: folder || "uploads",
    public_id: publicId,
    resource_type: "image",
    secure: true,
    fetch_format: "auto",
    quality: "auto",
  });

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
};

export const uploadMultipleImages = async (files, { folder } = {}) => {
  const results = await Promise.all(
    files.map((file) => uploadImage(file, { folder }))
  );
  return results;
};

export const deleteImage = async (publicId) => {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
};

export const generateOptimizedUrl = (publicId, { width, height, fetchFormat = "auto", quality = "auto" } = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    width,
    height,
    fetch_format: fetchFormat,
    quality,
    crop: width || height ? "fill" : undefined,
  });
};
