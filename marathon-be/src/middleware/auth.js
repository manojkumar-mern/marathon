import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, {
      statusCode: 401,
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    return errorResponse(res, {
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }
};
