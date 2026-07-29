import { Automation, AutomationLog, registerAutomation } from "./automation.model.js";
import Registration from "../modules/registration/registration.model.js";
import Certificate from "../modules/certificate/certificate.model.js";
import Result from "../modules/result/result.model.js";
import ReminderLog from "../models/ReminderLog.js";
import { AppError } from "../utils/AppError.js";
import { n8n } from "./n8n.service.js";
import { reminderScheduler } from "../services/reminder.service.js";

// Initialize default automations on system start
export const registerDefaultAutomations = async () => {
  await registerAutomation({
    name: "N8N Webhook Service",
    description: "Sends real-time workflow event webhooks to N8N integration engine",
    type: "webhook",
  });
  await registerAutomation({
    name: "Email Notification Provider",
    description: "Unified dispatch service for outbound email communications",
    type: "notification",
  });
  await registerAutomation({
    name: "WhatsApp Notification Provider",
    description: "Outbound messaging channel dispatching event notifications to WhatsApp",
    type: "notification",
  });
  await registerAutomation({
    name: "SMS Notification Provider",
    description: "Unified outbound SMS communication dispatch service",
    type: "notification",
  });
  await registerAutomation({
    name: "Push Notification Provider",
    description: "Unified FCM push notification dispatch service",
    type: "notification",
  });
  await registerAutomation({
    name: "Reminder Scheduler",
    description: "Automatic cron scheduling for race day and event timeline notifications",
    type: "scheduler",
  });
};

export const getDashboardStats = async () => {
  // Ensure default configurations exist in database
  await registerDefaultAutomations();

  const [
    activeCount,
    disabledCount,
    successCount,
    failedCount,
    pendingJobsCount,
    scheduledJobsCount,
    certStats,
    resultStats,
    reminderStats,
  ] = await Promise.all([
    Automation.countDocuments({ status: "active" }),
    Automation.countDocuments({ status: "disabled" }),
    AutomationLog.countDocuments({ status: "success" }),
    AutomationLog.countDocuments({ status: "failed" }),
    // Pending jobs count: Confirmed registrations that don't have results yet
    Registration.countDocuments({ status: "confirmed", isCompleted: { $ne: true } }),
    // Scheduled configurations: count configurations we support
    Promise.resolve(7), // 7 reminder offsets in REMINDER_CONFIGS
    // Certificate stats
    Certificate.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          emailed: { $sum: { $cond: [{ $eq: ["$status", "emailed"] }, 1, 0] } },
        },
      },
    ]),
    // Result stats
    Result.aggregate([
      {
        $group: {
          _id: "$isPublished",
          count: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$finishStatus", "Completed"] }, 1, 0] } },
        },
      },
    ]),
    // Reminder logs statistics
    ReminderLog.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  // Format Certificate statistics
  const certificates = {
    total: 0,
    byType: {},
  };
  for (const item of certStats) {
    certificates.total += item.count;
    certificates.byType[item._id || "unknown"] = item.count;
  }

  // Format Result publishing statistics
  const results = {
    total: 0,
    published: 0,
    unpublished: 0,
    completed: 0,
  };
  for (const item of resultStats) {
    results.total += item.count;
    results.completed += item.completed;
    if (item._id === true) {
      results.published = item.count;
    } else {
      results.unpublished = item.count;
    }
  }

  // Format Notification statistics
  let successReminders = 0;
  let failedReminders = 0;
  for (const item of reminderStats) {
    if (item._id === "success") successReminders = item.count;
    if (item._id === "failed") failedReminders = item.count;
  }

  const notifications = {
    totalSent: successReminders + failedReminders,
    successRate: successReminders + failedReminders > 0 
      ? Math.round((successReminders / (successReminders + failedReminders)) * 100) 
      : 100,
  };

  return {
    dashboard: {
      activeAutomations: activeCount,
      disabledAutomations: disabledCount,
      failedExecutions: failedCount,
      successfulExecutions: successCount,
      pendingJobs: pendingJobsCount,
      scheduledJobs: scheduledJobsCount,
    },
    statistics: {
      notifications,
      certificates,
      results,
    },
  };
};

export const getAutomationHistory = async (query = {}) => {
  const { event, date, type, status, page = 1, limit = 20 } = query;
  const filter = {};

  if (event) filter.eventName = event;
  if (type) filter.automationType = type;
  if (status) filter.status = status;
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.executionTime = { $gte: start, $lte: end };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [logs, total] = await Promise.all([
    AutomationLog.find(filter)
      .populate("automation", "name description type")
      .sort({ executionTime: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    AutomationLog.countDocuments(filter),
  ]);

  return {
    logs,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
};

export const enableAutomation = async (id) => {
  const auto = await Automation.findByIdAndUpdate(id, { status: "active" }, { new: true });
  if (!auto) throw new AppError("Automation not found", 404);
  return auto;
};

export const disableAutomation = async (id) => {
  const auto = await Automation.findByIdAndUpdate(id, { status: "disabled" }, { new: true });
  if (!auto) throw new AppError("Automation not found", 404);
  return auto;
};

export const triggerAutomationManually = async (id, payload = {}) => {
  const auto = await Automation.findById(id);
  if (!auto) throw new AppError("Automation not found", 404);

  if (auto.name === "Reminder Scheduler") {
    // Run reminder Scheduler manually asynchronously
    reminderScheduler.processReminders().catch(console.error);
    return { triggered: true, message: "Reminder Scheduler execution triggered successfully" };
  }

  if (auto.name === "N8N Webhook Service") {
    // Manually trigger certificate N8N payload hook
    const defaultData = payload.data || {
      registrationNumber: "REG-MANUAL-111",
      runnerDetails: { fullName: "Manual Run Test", email: "manual@example.com" },
      marathon: { title: "Centralized Automation Event" },
      raceCategory: { name: "Manual Category", distance: "10K" },
    };
    await n8n.sendCertificate(defaultData);
    return { triggered: true, message: "N8N manual webhook dispatched" };
  }

  throw new AppError("Manually triggering not supported for this automation type", 400);
};

export const retryFailedAutomation = async (logId) => {
  const log = await AutomationLog.findById(logId).populate("automation");
  if (!log) throw new AppError("Automation log entry not found", 404);
  if (log.status !== "failed") throw new AppError("Cannot retry a successful automation log", 400);

  // Increment retry count
  log.retryCount += 1;
  await log.save();

  if (log.automation?.name === "N8N Webhook Service") {
    const event = log.payload?.event || log.eventName;
    let result;
    const payloadData = log.payload?.data || log.payload || {};
    
    if (event === "REGISTRATION_SUCCESS" || event === "REGISTRATION") {
      result = await n8n.sendRegistration(payloadData);
    } else if (event === "PAYMENT_SUCCESS" || event === "PAYMENT") {
      result = await n8n.sendPaymentSuccess(payloadData);
    } else if (event === "CERTIFICATE_READY" || event === "CERTIFICATE") {
      result = await n8n.sendCertificate(payloadData);
    } else if (event === "MARKETING_CAMPAIGN" || event === "MARKETING") {
      result = await n8n.sendMarketingCampaign(payloadData);
    } else if (event === "EVENT_REMINDER" || event === "REMINDER") {
      result = await n8n.sendEventReminder(payloadData);
    } else {
      result = await n8n.sendCertificate(payloadData);
    }

    if (result === null) {
      throw new AppError("Retry failed to deliver payload to N8N webhook endpoint", 500);
    }

    log.status = "success";
    await log.save();
    return { retried: true, message: "N8N Webhook execution retried successfully" };
  }

  throw new AppError("Retrying is only supported for webhook automations", 400);
};

export const cancelPendingJob = async (jobId) => {
  const job = await ReminderLog.findByIdAndDelete(jobId);
  if (!job) throw new AppError("Pending job / Reminder log not found", 404);
  return { cancelled: true };
};
