import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
import * as dashboardController from "./dashboard.controller.js";

const router = Router();

router.use(authenticateUser, authorize("admin"));

router.get("/stats", dashboardController.getStats);
router.get("/recent", dashboardController.getRecentActivity);
router.get(
  "/analytics/registrations-per-marathon",
  dashboardController.getRegistrationsPerMarathon
);
router.get(
  "/analytics/registrations-per-category",
  dashboardController.getRegistrationsPerCategory
);
router.get(
  "/analytics/gender-distribution",
  dashboardController.getGenderDistribution
);
router.get(
  "/analytics/age-distribution",
  dashboardController.getAgeDistribution
);
router.get(
  "/analytics/monthly-trend",
  dashboardController.getMonthlyTrend
);
router.get(
  "/marathon/:id",
  dashboardController.getMarathonOverview
);

export default router;
