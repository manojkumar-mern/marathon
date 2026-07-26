import { env } from "../config/env.js";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return { statusCode: 400, message };
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate value for ${field}. Please use another value.`;
  return { statusCode: 409, message };
};

const handleValidationErrorDB = (err) => {
  const messages = Object.values(err.errors).map((el) => el.message);
  return { statusCode: 400, message: messages.join(". ") };
};

const handleJWTError = () => {
  return { statusCode: 401, message: "Invalid token. Please log in again." };
};

const handleJWTExpiredError = () => {
  return { statusCode: 401, message: "Token expired. Please log in again." };
};

const handleMulterError = (err) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return { statusCode: 400, message: "File size exceeds the maximum allowed size" };
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return { statusCode: 400, message: "Unexpected file field" };
  }
  return { statusCode: 400, message: err.message };
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    const handled = handleCastErrorDB(err);
    statusCode = handled.statusCode;
    message = handled.message;
  }

  if (err.code === 11000) {
    const handled = handleDuplicateFieldsDB(err);
    statusCode = handled.statusCode;
    message = handled.message;
  }

  if (err.name === "ValidationError") {
    const handled = handleValidationErrorDB(err);
    statusCode = handled.statusCode;
    message = handled.message;
  }

  if (err.name === "JsonWebTokenError") {
    const handled = handleJWTError();
    statusCode = handled.statusCode;
    message = handled.message;
  }

  if (err.name === "TokenExpiredError") {
    const handled = handleJWTExpiredError();
    statusCode = handled.statusCode;
    message = handled.message;
  }

  if (err.name === "MulterError") {
    const handled = handleMulterError(err);
    statusCode = handled.statusCode;
    message = handled.message;
  }

  if (statusCode === 500) {
    if (env.isProduction) {
      message = "Internal server error";
    } else {
      console.error("❌ Unhandled error:", err);
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.isDevelopment && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
