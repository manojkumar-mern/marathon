import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import * as certController from "./certificate.controller.js";

const router = Router();

// Public routes (no auth required — used for sharing / printing)
router.get("/verify/:certNumber", certController.verify);
router.get("/:id/preview", certController.preview);

// Admin only
router.use(authenticateUser, authorize("admin"));

router.get("/", certController.list);
router.get("/:id", certController.getById);
router.post("/generate", certController.generate);
router.post("/:id/regenerate", certController.regenerate);
router.post("/:id/email", certController.sendEmail);
router.delete("/:id", certController.remove);

export default router;
