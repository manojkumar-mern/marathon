import { AppError } from "../utils/AppError.js";

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new AppError("Insufficient permissions", 403);
  }
  next();
};
