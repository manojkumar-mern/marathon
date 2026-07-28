import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import * as adminController from "./admin.controller.js";
import * as settingsController from "../settings/settings.controller.js";

const router = Router();

router.use(authenticateUser, authorize("admin"));

router.get("/dashboard", adminController.getDashboard);

router.get("/settings", settingsController.get);
router.put("/settings", settingsController.update);

export default router;

