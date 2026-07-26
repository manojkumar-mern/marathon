import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import * as dashboardService from "./dashboard.service.js";

export const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();

  return successResponse(res, {
    message: "Dashboard statistics retrieved successfully",
    data: stats,
  });
});

export const getRecentActivity = asyncHandler(async (req, res) => {
  const activity = await dashboardService.getRecentActivity();

  return successResponse(res, {
    message: "Recent activity retrieved successfully",
    data: activity,
  });
});

export const getRegistrationsPerMarathon = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRegistrationsPerMarathon();

  return successResponse(res, {
    message: "Registrations per marathon retrieved successfully",
    data,
  });
});

export const getRegistrationsPerCategory = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRegistrationsPerCategory();

  return successResponse(res, {
    message: "Registrations per category retrieved successfully",
    data,
  });
});

export const getGenderDistribution = asyncHandler(async (req, res) => {
  const data = await dashboardService.getGenderDistribution();

  return successResponse(res, {
    message: "Gender distribution retrieved successfully",
    data,
  });
});

export const getAgeDistribution = asyncHandler(async (req, res) => {
  const data = await dashboardService.getAgeDistribution();

  return successResponse(res, {
    message: "Age distribution retrieved successfully",
    data,
  });
});

export const getMonthlyTrend = asyncHandler(async (req, res) => {
  const data = await dashboardService.getMonthlyTrend();

  return successResponse(res, {
    message: "Monthly registration trend retrieved successfully",
    data,
  });
});

export const getMarathonOverview = asyncHandler(async (req, res) => {
  const overview = await dashboardService.getMarathonOverview(req.params.id);

  if (!overview) {
    return successResponse(res, {
      statusCode: 404,
      message: "Marathon not found",
    });
  }

  return successResponse(res, {
    message: "Marathon overview retrieved successfully",
    data: overview,
  });
});
