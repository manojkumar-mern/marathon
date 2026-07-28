import { Router } from "express";
import {
  listPages, getPage, getPageBySlug, createPage, updatePage, deletePage,
  listAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
} from "./cms.controller.js";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";

const router = Router();

router.get("/pages", listPages);
router.get("/pages/slug/:slug", getPageBySlug);
router.get("/pages/:id", getPage);
router.post("/pages", authenticateUser, authorize("admin"), createPage);
router.put("/pages/:id", authenticateUser, authorize("admin"), updatePage);
router.delete("/pages/:id", authenticateUser, authorize("admin"), deletePage);

router.get("/announcements", listAnnouncements);
router.post("/announcements", authenticateUser, authorize("admin"), createAnnouncement);
router.put("/announcements/:id", authenticateUser, authorize("admin"), updateAnnouncement);
router.delete("/announcements/:id", authenticateUser, authorize("admin"), deleteAnnouncement);

export default router;
