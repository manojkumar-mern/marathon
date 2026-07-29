import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import * as resultController from "./result.controller.js";
import {
  createResultValidation,
  updateResultValidation,
  resultIdParam,
  marathonIdParam,
  registrationIdParam,
} from "./result.validation.js";

const router = Router();

// Public: participants can view results, leaderboards, and individual results
router.get("/", resultController.list);
router.get("/leaderboard/:marathonId", marathonIdParam, resultController.getLeaderboard);
router.get("/registration/:registrationId", registrationIdParam, resultController.getParticipantResult);
router.get("/:id", resultIdParam, resultController.getById);

// Admin only: create / update / delete / bulk import / publish / unpublish
router.post("/", authenticateUser, authorize("admin"), createResultValidation, resultController.create);
router.post("/bulk-import", authenticateUser, authorize("admin"), resultController.bulkImport);
router.post("/publish/:marathonId", authenticateUser, authorize("admin"), marathonIdParam, resultController.publish);
router.post("/unpublish/:marathonId", authenticateUser, authorize("admin"), marathonIdParam, resultController.unpublish);
router.put("/:id", authenticateUser, authorize("admin"), updateResultValidation, resultController.update);
router.delete("/:id", authenticateUser, authorize("admin"), resultIdParam, resultController.remove);

export default router;
