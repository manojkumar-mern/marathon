import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, {
        statusCode: 400,
        message: errors.array()[0].msg,
      });
    }

    const { fullName, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, {
        statusCode: 409,
        message: "An account with this email already exists",
      });
    }

    await User.create({ fullName, email, password, phone });

    return successResponse(res, {
      statusCode: 201,
      message: "Registration successful",
    });
  } catch {
    return errorResponse(res, {
      statusCode: 500,
      message: "Registration failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, {
        statusCode: 400,
        message: errors.array()[0].msg,
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return successResponse(res, {
      message: "Login successful",
      data: {
        token,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return errorResponse(res, {
      statusCode: 500,
      message: "Login failed",
    });
  }
};
