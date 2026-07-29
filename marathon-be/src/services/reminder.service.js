import mongoose from "mongoose";
import Marathon from "../modules/marathon/marathon.model.js";
import Registration from "../modules/registration/registration.model.js";
import ReminderLog from "../models/ReminderLog.js";
import { notificationService } from "./notification/notification.service.js";
import { NOTIFICATION_TYPES } from "./notification/notification.types.js";

// Timing configs and offsets in milliseconds
const REMINDER_CONFIGS = [
  { type: "30_DAYS_BEFORE", offsetMs: 30 * 24 * 60 * 60 * 1000, toleranceMs: 12 * 60 * 60 * 1000, notificationType: NOTIFICATION_TYPES.EVENT_REMINDER, optional: true },
  { type: "15_DAYS_BEFORE", offsetMs: 15 * 24 * 60 * 60 * 1000, toleranceMs: 12 * 60 * 60 * 1000, notificationType: NOTIFICATION_TYPES.EVENT_REMINDER, optional: true },
  { type: "7_DAYS_BEFORE",  offsetMs: 7 * 24 * 60 * 60 * 1000,  toleranceMs: 12 * 60 * 60 * 1000, notificationType: NOTIFICATION_TYPES.EVENT_REMINDER, optional: false },
  { type: "3_DAYS_BEFORE",  offsetMs: 3 * 24 * 60 * 60 * 1000,  toleranceMs: 12 * 60 * 60 * 1000, notificationType: NOTIFICATION_TYPES.EVENT_REMINDER, optional: false },
  { type: "2_DAYS_BEFORE",  offsetMs: 2 * 24 * 60 * 60 * 1000,  toleranceMs: 12 * 60 * 60 * 1000, notificationType: NOTIFICATION_TYPES.EVENT_REMINDER, optional: false },
  { type: "24_HOURS_BEFORE", offsetMs: 24 * 60 * 60 * 1000,     toleranceMs: 4 * 60 * 60 * 1000,  notificationType: NOTIFICATION_TYPES.RACE_DAY_REMINDER, optional: false },
  { type: "2_HOURS_BEFORE_START", offsetMs: 2 * 60 * 60 * 1000,  toleranceMs: 30 * 60 * 1000,      notificationType: NOTIFICATION_TYPES.RACE_DAY_REMINDER, optional: false },
];

export const reminderScheduler = {
  /**
   * Run the scheduler cycle to process eligible reminders
   */
  async processReminders() {
    console.log("[ReminderScheduler] Starting reminder processing cycle...");
    let auto = null;
    try {
      auto = await mongoose.model("Automation").findOne({ name: "Reminder Scheduler" });
    } catch (e) {}

    if (auto && auto.status === "disabled") {
      console.log("[ReminderScheduler] Reminder Scheduler is disabled — skipping execution");
      return;
    }

    const startTime = Date.now();
    try {
      const activeMarathons = await Marathon.find({
        status: "published",
        isDeleted: { $ne: true },
        eventDate: { $gt: new Date() } // Only upcoming marathons
      });

      console.log(`[ReminderScheduler] Found ${activeMarathons.length} active upcoming marathons.`);

      for (const marathon of activeMarathons) {
        await this.processMarathonReminders(marathon);
      }

      const duration = Date.now() - startTime;
      if (auto) {
        await mongoose.model("AutomationLog").create({
          automation: auto._id,
          eventName: "REMINDER_SCHEDULER_CYCLE",
          automationType: "scheduler",
          status: "success",
          processingDuration: duration,
        });
        auto.lastExecutedAt = new Date();
        auto.successCount += 1;
        await auto.save();
      }

      console.log("[ReminderScheduler] Reminder processing cycle finished successfully.");
    } catch (err) {
      console.error("[ReminderScheduler] Error during scheduler execution:", err.message);
      const duration = Date.now() - startTime;
      if (auto) {
        await mongoose.model("AutomationLog").create({
          automation: auto._id,
          eventName: "REMINDER_SCHEDULER_CYCLE",
          automationType: "scheduler",
          status: "failed",
          errorMessage: err.message,
          processingDuration: duration,
        });
        auto.lastExecutedAt = new Date();
        auto.failureCount += 1;
        await auto.save();
      }
    }
  },

  /**
   * Process reminders for a single marathon event
   */
  async processMarathonReminders(marathon) {
    const now = Date.now();
    const eventTime = new Date(marathon.eventDate).getTime();
    const diffMs = eventTime - now;

    // Find all triggers active in the current time delta window
    const eligibleTriggers = REMINDER_CONFIGS.filter((cfg) => {
      // Check if disabled via environment configuration
      const envKey = `DISABLE_REMINDER_${cfg.type}`;
      if (process.env[envKey] === "true") return false;

      const lowerBound = cfg.offsetMs - cfg.toleranceMs;
      const upperBound = cfg.offsetMs + cfg.toleranceMs;
      return diffMs >= lowerBound && diffMs <= upperBound;
    });

    if (eligibleTriggers.length === 0) return;

    console.log(`[ReminderScheduler] Marathon '${marathon.title}' matches triggers: ${eligibleTriggers.map(t => t.type).join(", ")}`);

    // Fetch confirmed registrations
    const registrations = await Registration.find({
      marathon: marathon._id,
      status: "confirmed"
    }).populate("user", "email phone fullName");

    for (const trigger of eligibleTriggers) {
      for (const reg of registrations) {
        await this.sendReminderIfEligible(reg, marathon, trigger);
      }
    }
  },

  /**
   * Safe notification dispatcher with duplicate prevention log checks
   */
  async sendReminderIfEligible(registration, marathon, trigger) {
    // Check Notification History to prevent duplicate dispatches
    const alreadySent = await ReminderLog.findOne({
      registration: registration._id,
      reminderType: trigger.type
    });

    if (alreadySent && alreadySent.status === "success") {
      return; // Skip duplicate
    }

    console.log(`[ReminderScheduler] Dispatching '${trigger.type}' to ${registration.runnerDetails?.fullName || "Runner"}...`);

    // Prepare unified notification payload format
    const recipient = {
      email: registration.runnerDetails?.email || registration.user?.email,
      phone: registration.runnerDetails?.phone || registration.user?.phone,
    };

    const data = {
      participantName: registration.runnerDetails?.fullName || registration.user?.fullName || "Runner",
      marathonName: marathon.title,
      eventDate: new Date(marathon.eventDate).toLocaleDateString('en-IN'),
      venue: marathon.venue?.name || "Event Venue",
      reportingTime: marathon.startTime || "5:00 AM",
      registrationId: registration._id,
      bibNumber: registration.bibNumber || "",
    };

    let logStatus = "failed";
    let logError = null;

    try {
      const dispatch = await notificationService.send({
        recipient,
        type: trigger.notificationType,
        data
      });

      if (dispatch.success) {
        logStatus = "success";
      } else {
        logError = "Channel send returned unsuccessful";
      }
    } catch (error) {
      logError = error.message;
      console.error(`[ReminderScheduler] Failed dispatch trigger ${trigger.type}:`, error.message);
    }

    // Save reminder log history to enforce duplicate protection
    try {
      await ReminderLog.findOneAndUpdate(
        { registration: registration._id, reminderType: trigger.type },
        {
          marathon: marathon._id,
          status: logStatus,
          sentAt: new Date(),
          channels: trigger.notificationType === NOTIFICATION_TYPES.RACE_DAY_REMINDER ? ["whatsapp", "sms"] : ["email", "whatsapp"],
          error: logError
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.error("[ReminderScheduler] Failed to write ReminderLog history:", dbErr.message);
    }
  }
};
