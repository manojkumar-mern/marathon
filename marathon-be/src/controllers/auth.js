import { validationResult } from "express-validator";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/jwt.js";
import { sendWelcomeEmail } from "../services/email.service.js";

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const { fullName, email, password, phone } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new AppError("An account with this email already exists", 409);
  }

  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw new AppError("An account with this phone number already exists", 409);
  }

  const user = await User.create({ fullName, email, password, phone });

  sendWelcomeEmail(user);

  const token = generateToken({ id: user._id, role: user.role });

  return successResponse(res, {
    statusCode: 201,
    message: "Registration successful",
    data: {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account deactivated. Contact support.", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({ id: user._id, role: user.role });

  return successResponse(res, {
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  return successResponse(res, {
    message: "User profile retrieved successfully",
    data: {
      user: req.user,
    },
  });
});
