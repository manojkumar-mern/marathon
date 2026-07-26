import { validationResult } from "express-validator";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import * as marathonService from "./marathon.service.js";

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const marathon = await marathonService.createMarathon(req.body);

  return successResponse(res, {
    statusCode: 201,
    message: "Marathon created successfully",
    data: { marathon },
  });
});

export const list = asyncHandler(async (req, res) => {
  const query = { ...req.query };

  if (query.all === "true" && (!req.user || req.user.role !== "admin")) {
    delete query.all;
  }

  const result = await marathonService.getAllMarathons(query);

  return successResponse(res, {
    message: "Marathons retrieved successfully",
    data: result,
  });
});

export const getBySlug = asyncHandler(async (req, res) => {
  const marathon = await marathonService.getMarathonBySlug(req.params.slug);

  return successResponse(res, {
    message: "Marathon retrieved successfully",
    data: { marathon },
  });
});

export const getById = asyncHandler(async (req, res) => {
  const marathon = await marathonService.getMarathonById(req.params.id);

  return successResponse(res, {
    message: "Marathon retrieved successfully",
    data: { marathon },
  });
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const marathon = await marathonService.updateMarathon(req.params.id, req.body);

  return successResponse(res, {
    message: "Marathon updated successfully",
    data: { marathon },
  });
});

export const remove = asyncHandler(async (req, res) => {
  await marathonService.deleteMarathon(req.params.id);

  return successResponse(res, {
    message: "Marathon deleted successfully",
  });
});
