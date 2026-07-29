import { validationResult } from "express-validator";
import { cmsService } from "./cms.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const listPages = asyncHandler(async (req, res) => {
  const result = await cmsService.listPages(req.query);
  return successResponse(res, { data: result });
});

export const getPage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const result = await cmsService.getPage(req.params.id);
  return successResponse(res, { data: result });
});

export const getPageBySlug = asyncHandler(async (req, res) => {
  const result = await cmsService.getPageBySlug(req.params.slug);
  return successResponse(res, { data: result });
});

export const createPage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const result = await cmsService.createPage(req.body);
  return successResponse(res, { statusCode: 201, data: result });
});

export const updatePage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const result = await cmsService.updatePage(req.params.id, req.body);
  return successResponse(res, { data: result });
});

export const deletePage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  await cmsService.deletePage(req.params.id);
  return successResponse(res, { message: "Page deleted" });
});

export const listAnnouncements = asyncHandler(async (req, res) => {
  const result = await cmsService.listAnnouncements();
  return successResponse(res, { data: result });
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const result = await cmsService.createAnnouncement(req.body);
  return successResponse(res, { statusCode: 201, data: result });
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const result = await cmsService.updateAnnouncement(req.params.id, req.body);
  return successResponse(res, { data: result });
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  await cmsService.deleteAnnouncement(req.params.id);
  return successResponse(res, { message: "Announcement deleted" });
});
