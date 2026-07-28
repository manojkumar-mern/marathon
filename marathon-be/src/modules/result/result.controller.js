import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import * as resultService from "./result.service.js";

export const list = asyncHandler(async (req, res) => {
  const data = await resultService.getAllResults(req.query);
  return successResponse(res, {
    message: "Results retrieved successfully",
    data,
  });
});

export const getById = asyncHandler(async (req, res) => {
  const result = await resultService.getResultById(req.params.id);
  return successResponse(res, {
    message: "Result retrieved successfully",
    data: { result },
  });
});

export const create = asyncHandler(async (req, res) => {
  const result = await resultService.createResult(req.body);
  return successResponse(res, {
    statusCode: 201,
    message: "Result created successfully",
    data: { result },
  });
});

export const update = asyncHandler(async (req, res) => {
  const result = await resultService.updateResult(req.params.id, req.body);
  return successResponse(res, {
    message: "Result updated successfully",
    data: { result },
  });
});

export const remove = asyncHandler(async (req, res) => {
  await resultService.deleteResult(req.params.id);
  return successResponse(res, { message: "Result deleted successfully" });
});

export const bulkImport = asyncHandler(async (req, res) => {
  const rows = req.body.results;
  if (!Array.isArray(rows) || rows.length === 0) {
    return successResponse(res, {
      statusCode: 400,
      message: "No results provided",
      data: { created: 0, errors: [] },
    });
  }
  const summary = await resultService.bulkImportResults(rows);
  return successResponse(res, {
    message: `Imported ${summary.created} result(s)`,
    data: summary,
  });
});
