import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const authenticateUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyToken(token);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError("User not found", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account deactivated. Contact support.", 401);
  }

  req.user = user;
  next();
});
