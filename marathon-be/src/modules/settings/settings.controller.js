import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import * as settingsService from "./settings.service.js";

export const get = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings();
  return successResponse(res, {
    message: "Settings retrieved successfully",
    data: settings,
  });
});

export const update = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body);
  return successResponse(res, {
    message: "Settings saved successfully",
    data: settings,
  });
});
