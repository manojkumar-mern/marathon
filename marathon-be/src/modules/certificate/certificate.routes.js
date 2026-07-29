import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import * as certController from "./certificate.controller.js";
import {
  createTemplateValidation,
  updateTemplateValidation,
  certIdParam,
  templateIdParam,
  registrationIdParam,
  certNumberParam,
} from "./certificate.validation.js";

const router = Router();

// Public routes (no auth required — used for sharing / printing / verifying)
router.get("/verify/:certNumber", certNumberParam, certController.verify);
router.get("/:id/preview", certIdParam, certController.preview);

// Secure routes (authenticated users)
router.get("/status/:registrationId", authenticateUser, registrationIdParam, certController.getStatus);

// Admin only routes
router.use(authenticateUser, authorize("admin"));

// Template Management
router.post("/templates", createTemplateValidation, certController.createTemplate);
router.get("/templates", certController.listTemplates);
router.get("/templates/:id", templateIdParam, certController.getTemplateById);
router.put("/templates/:id", updateTemplateValidation, certController.updateTemplate);
router.delete("/templates/:id", templateIdParam, certController.deleteTemplate);

// Certificate Operations
router.get("/", certController.list);
router.get("/:id", certIdParam, certController.getById);
router.post("/generate", certController.generate);
router.post("/:id/regenerate", certIdParam, certController.regenerate);
router.post("/:id/email", certIdParam, certController.sendEmail);
router.get("/:id/download", certIdParam, certController.download);
router.delete("/:id", certIdParam, certController.remove);

export default router;
