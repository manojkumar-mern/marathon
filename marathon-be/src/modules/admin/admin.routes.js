import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import * as adminController from "./admin.controller.js";

const router = Router();

router.use(authenticateUser, authorize("admin"));

router.get("/dashboard", adminController.getDashboard);

export default router;
