import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import * as adminService from "./admin.service.js";
import * as autoService from "../../automation/automation.service.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await adminService.getDashboardData();
  return successResponse(res, {
    message: "Admin dashboard data retrieved successfully",
    data,
  });
});

// --- AUTOMATION CENTER HANDLERS ---

export const getAutomationDashboard = asyncHandler(async (req, res) => {
  const data = await autoService.getDashboardStats();
  return successResponse(res, {
    message: "Automation dashboard stats retrieved successfully",
    data,
  });
});

export const getAutomationHistory = asyncHandler(async (req, res) => {
  const data = await autoService.getAutomationHistory(req.query);
  return successResponse(res, {
    message: "Automation history logs retrieved successfully",
    data,
  });
});

export const enableAutomation = asyncHandler(async (req, res) => {
  const automation = await autoService.enableAutomation(req.params.id);
  return successResponse(res, {
    message: "Automation enabled successfully",
    data: { automation },
  });
});

export const disableAutomation = asyncHandler(async (req, res) => {
  const automation = await autoService.disableAutomation(req.params.id);
  return successResponse(res, {
    message: "Automation disabled successfully",
    data: { automation },
  });
});

export const triggerAutomation = asyncHandler(async (req, res) => {
  const result = await autoService.triggerAutomationManually(req.params.id, req.body);
  return successResponse(res, {
    message: result.message || "Automation triggered successfully",
    data: result,
  });
});

export const retryFailedLog = asyncHandler(async (req, res) => {
  const result = await autoService.retryFailedAutomation(req.params.logId);
  return successResponse(res, {
    message: result.message || "Failed automation retried successfully",
    data: result,
  });
});

export const cancelPendingJob = asyncHandler(async (req, res) => {
  const result = await autoService.cancelPendingJob(req.params.jobId);
  return successResponse(res, {
    message: "Pending job cancelled successfully",
    data: result,
  });
});
