import { validationResult } from "express-validator";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import * as registrationService from "./registration.service.js";
import { sendRegistrationConfirmationEmail } from "../../services/email.service.js";
import Marathon from "../marathon/marathon.model.js";

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const registration = await registrationService.createRegistration(
    req.user._id,
    req.body
  );

  const marathon = await Marathon.findById(req.body.marathon)
    .select("title eventDate venue")
    .lean();

  sendRegistrationConfirmationEmail(req.user, registration, marathon);

  return successResponse(res, {
    statusCode: 201,
    message: "Registration submitted successfully",
    data: { registration },
  });
});

export const getMyRegistrations = asyncHandler(async (req, res) => {
  const result = await registrationService.getMyRegistrations(
    req.user._id,
    req.query
  );

  return successResponse(res, {
    message: "Registrations retrieved successfully",
    data: result,
  });
});

export const getById = asyncHandler(async (req, res) => {
  const registration = await registrationService.getRegistrationById(
    req.params.id
  );

  const isOwner =
    req.user &&
    registration.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user && req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return errorResponse(res, {
      statusCode: 403,
      message: "You do not have permission to view this registration",
    });
  }

  return successResponse(res, {
    message: "Registration retrieved successfully",
    data: { registration },
  });
});

export const list = asyncHandler(async (req, res) => {
  const result = await registrationService.getAllRegistrations(req.query);

  return successResponse(res, {
    message: "Registrations retrieved successfully",
    data: result,
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

  const registration = await registrationService.updateRegistration(
    req.params.id,
    req.body
  );

  return successResponse(res, {
    message: "Registration updated successfully",
    data: { registration },
  });
});

export const remove = asyncHandler(async (req, res) => {
  await registrationService.deleteRegistration(req.params.id);

  return successResponse(res, {
    message: "Registration deleted successfully",
  });
});
