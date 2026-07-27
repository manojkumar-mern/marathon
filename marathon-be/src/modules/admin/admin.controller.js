import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import * as adminService from "./admin.service.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await adminService.getDashboardData();

  return successResponse(res, {
    message: "Admin dashboard data retrieved successfully",
    data,
  });
});
