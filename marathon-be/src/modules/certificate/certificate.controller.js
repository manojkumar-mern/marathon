import axios from "axios";
import { validationResult } from "express-validator";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import * as certService from "./certificate.service.js";
import { AppError } from "../../utils/AppError.js";

// --- TEMPLATE HANDLERS ---

export const createTemplate = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const template = await certService.createTemplate(req.body);
  return successResponse(res, {
    statusCode: 201,
    message: "Certificate template created successfully",
    data: { template },
  });
});

export const listTemplates = asyncHandler(async (req, res) => {
  const data = await certService.getAllTemplates(req.query);
  return successResponse(res, { message: "Templates retrieved successfully", data });
});

export const getTemplateById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const template = await certService.getTemplateById(req.params.id);
  return successResponse(res, { message: "Template retrieved successfully", data: { template } });
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const template = await certService.updateTemplate(req.params.id, req.body);
  return successResponse(res, { message: "Template updated successfully", data: { template } });
});

export const deleteTemplate = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  await certService.deleteTemplate(req.params.id);
  return successResponse(res, { message: "Template deleted successfully" });
});

// --- CERTIFICATE HANDLERS ---

export const list = asyncHandler(async (req, res) => {
  const data = await certService.getAllCertificates(req.query);
  return successResponse(res, { message: "Certificates retrieved successfully", data });
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const certificate = await certService.getCertificateById(req.params.id);
  return successResponse(res, { message: "Certificate retrieved successfully", data: { certificate } });
});

export const generate = asyncHandler(async (req, res) => {
  const summary = await certService.generateCertificates(req.body);
  return successResponse(res, {
    statusCode: 201,
    message: `Generated ${summary.generated} certificate(s)`,
    data: summary,
  });
});

export const regenerate = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const certificate = await certService.regenerateCertificate(req.params.id);
  return successResponse(res, { message: "Certificate regenerated", data: { certificate } });
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  await certService.deleteCertificate(req.params.id);
  return successResponse(res, { message: "Certificate deleted successfully" });
});

export const preview = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const html = await certService.getCertificateHTML(req.params.id);
  if (req.query.download === "true") {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", 'attachment; filename="certificate.html"');
    return res.send(html);
  }
  res.setHeader("Content-Type", "text/html");
  return res.send(html);
});

export const download = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const certificate = await certService.getCertificateById(req.params.id);
  if (!certificate.certificateUrl) {
    throw new AppError("Certificate PDF has not been generated yet", 400);
  }
  const response = await axios.get(certificate.certificateUrl, { responseType: "stream" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${certificate.certificateNumber}.pdf"`);
  return response.data.pipe(res);
});

export const sendEmail = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const result = await certService.sendCertificateEmail(req.params.id);
  return successResponse(res, { message: "Certificate emailed successfully", data: result });
});

export const verify = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const certificate = await certService.verifyCertificate(req.params.certNumber);
  const html = await certService.getCertificateHTML(certificate._id);
  res.setHeader("Content-Type", "text/html");
  return res.send(html);
});

export const getStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, {
      statusCode: 400,
      message: errors.array()[0].msg,
    });
  }

  const status = await certService.getCertificateStatus(req.params.registrationId);
  return successResponse(res, {
    message: "Certificate status retrieved successfully",
    data: status,
  });
});
