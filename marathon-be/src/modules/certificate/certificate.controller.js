import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import * as certService from "./certificate.service.js";

export const list = asyncHandler(async (req, res) => {
  const data = await certService.getAllCertificates(req.query);
  return successResponse(res, { message: "Certificates retrieved successfully", data });
});

export const getById = asyncHandler(async (req, res) => {
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
  const certificate = await certService.regenerateCertificate(req.params.id);
  return successResponse(res, { message: "Certificate regenerated", data: { certificate } });
});

export const remove = asyncHandler(async (req, res) => {
  await certService.deleteCertificate(req.params.id);
  return successResponse(res, { message: "Certificate deleted successfully" });
});

export const preview = asyncHandler(async (req, res) => {
  const html = await certService.getCertificateHTML(req.params.id);
  if (req.query.download === "true") {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", 'attachment; filename="certificate.html"');
    return res.send(html);
  }
  res.setHeader("Content-Type", "text/html");
  return res.send(html);
});

export const sendEmail = asyncHandler(async (req, res) => {
  const result = await certService.sendCertificateEmail(req.params.id);
  return successResponse(res, { message: "Certificate emailed successfully", data: result });
});

export const verify = asyncHandler(async (req, res) => {
  const certificate = await certService.verifyCertificate(req.params.certNumber);
  const html = await certService.getCertificateHTML(certificate._id);
  res.setHeader("Content-Type", "text/html");
  return res.send(html);
});
