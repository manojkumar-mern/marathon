import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import * as resultController from "./result.controller.js";

const router = Router();

// Public: participants can view results
router.get("/", resultController.list);
router.get("/:id", resultController.getById);

// Admin only: create / update / delete / bulk import
router.post("/", authenticateUser, authorize("admin"), resultController.create);
router.post("/bulk-import", authenticateUser, authorize("admin"), resultController.bulkImport);
router.put("/:id", authenticateUser, authorize("admin"), resultController.update);
router.delete("/:id", authenticateUser, authorize("admin"), resultController.remove);

export default router;
