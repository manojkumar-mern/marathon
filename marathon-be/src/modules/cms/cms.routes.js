import { Router } from "express";
import {
  listPages, getPage, getPageBySlug, createPage, updatePage, deletePage,
  listAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
} from "./cms.controller.js";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import {
  createPageValidation,
  updatePageValidation,
  createAnnouncementValidation,
  updateAnnouncementValidation,
  pageIdParam,
  announcementIdParam,
} from "./cms.validation.js";

const router = Router();

router.get("/pages", listPages);
router.get("/pages/slug/:slug", getPageBySlug);
router.get("/pages/:id", pageIdParam, getPage);
router.post("/pages", authenticateUser, authorize("admin"), createPageValidation, createPage);
router.put("/pages/:id", authenticateUser, authorize("admin"), updatePageValidation, updatePage);
router.delete("/pages/:id", authenticateUser, authorize("admin"), pageIdParam, deletePage);

router.get("/announcements", listAnnouncements);
router.post("/announcements", authenticateUser, authorize("admin"), createAnnouncementValidation, createAnnouncement);
router.put("/announcements/:id", authenticateUser, authorize("admin"), updateAnnouncementValidation, updateAnnouncement);
router.delete("/announcements/:id", authenticateUser, authorize("admin"), announcementIdParam, deleteAnnouncement);

export default router;
