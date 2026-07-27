import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import {
  createMarathonValidation,
  updateMarathonValidation,
  marathonSlugParam,
  listMarathonsValidation,
} from "./marathon.validation.js";
import * as marathonController from "./marathon.controller.js";

const router = Router();

router.get("/", listMarathonsValidation, marathonController.list);
router.get("/slug/:slug", marathonSlugParam, marathonController.getBySlug);
router.get("/:id", marathonController.getById);
router.post(
  "/",
  authenticateUser,
  authorize("admin"),
  createMarathonValidation,
  marathonController.create
);
router.put(
  "/:id",
  authenticateUser,
  authorize("admin"),
  updateMarathonValidation,
  marathonController.update
);
router.delete(
  "/:id",
  authenticateUser,
  authorize("admin"),
  marathonController.remove
);
router.patch(
  "/:id/status",
  authenticateUser,
  authorize("admin"),
  marathonController.updateStatus
);

export default router;
