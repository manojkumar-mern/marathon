import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import * as adminController from "./admin.controller.js";
import * as settingsController from "../settings/settings.controller.js";

const router = Router();

router.use(authenticateUser, authorize("admin"));

router.get("/dashboard", adminController.getDashboard);

// Centralized Automation Center routes
router.get("/automation/dashboard", adminController.getAutomationDashboard);
router.get("/automation/history", adminController.getAutomationHistory);
router.post("/automation/:id/enable", adminController.enableAutomation);
router.post("/automation/:id/disable", adminController.disableAutomation);
router.post("/automation/:id/trigger", adminController.triggerAutomation);
router.post("/automation/logs/:logId/retry", adminController.retryFailedLog);
router.delete("/automation/jobs/:jobId", adminController.cancelPendingJob);

router.get("/settings", settingsController.get);
router.put("/settings", settingsController.update);

// Zoho CRM integration endpoints
router.get("/zoho/test", adminController.testZohoConnection);
router.get("/zoho/test-registration", adminController.testRegistrationSync);
router.post("/zoho/sync/:registrationId", adminController.syncZohoRegistration);

export default router;

