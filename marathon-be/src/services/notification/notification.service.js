import mongoose from "mongoose";
import { NOTIFICATION_CONFIGS, CHANNELS } from "./notification.types.js";
import { emailProvider } from "./providers/email.provider.js";
import { whatsappProvider } from "./providers/whatsapp.provider.js";
import { smsProvider } from "./providers/sms.provider.js";
import { pushProvider } from "./providers/push.provider.js";

const PROVIDERS = {
  [CHANNELS.EMAIL]: emailProvider,
  [CHANNELS.WHATSAPP]: whatsappProvider,
  [CHANNELS.SMS]: smsProvider,
  [CHANNELS.PUSH]: pushProvider,
};

// In-memory cache for automation configurations with 5s TTL
let cache = null;
let cacheTime = 0;

const getAutomationsMap = async () => {
  const now = Date.now();
  if (cache && now - cacheTime < 5000) {
    return cache;
  }
  const names = [
    "Email Notification Provider",
    "WhatsApp Notification Provider",
    "SMS Notification Provider",
    "Push Notification Provider",
  ];
  const map = {};
  try {
    const docs = await mongoose.model("Automation").find({ name: { $in: names } });
    for (const doc of docs) {
      map[doc.name] = doc;
    }
  } catch (err) {
    console.warn("[NotificationService] Failed to fetch automations map:", err.message);
  }
  cache = map;
  cacheTime = now;
  return map;
};

const PROVIDER_NAME_MAP = {
  [CHANNELS.EMAIL]: "Email Notification Provider",
  [CHANNELS.WHATSAPP]: "WhatsApp Notification Provider",
  [CHANNELS.SMS]: "SMS Notification Provider",
  [CHANNELS.PUSH]: "Push Notification Provider",
};

export const notificationService = {
  /**
   * Dispatches a unified notification to one or more channels
   * @param {Object} options
   * @param {Object} options.recipient - { email, phone, fcmToken }
   * @param {string} options.type - Notification type constant
   * @param {Object} options.data - Dynamic context data
   * @param {string[]} [options.channels] - Override default channels
   */
  async send({ recipient, type, data, channels }) {
    const config = NOTIFICATION_CONFIGS[type];
    if (!config) {
      console.warn(`[NotificationService] Unregistered notification type: ${type}`);
      return { success: false, error: "Invalid notification type" };
    }

    const activeChannels = channels || config.defaultChannels || [];
    const results = {};
    const automationsMap = await getAutomationsMap();

    const dispatchPromises = activeChannels.map(async (channel) => {
      const provider = PROVIDERS[channel];
      const formatter = config.formatters?.[channel];

      if (!provider) {
        results[channel] = { success: false, error: "No provider configured for channel" };
        return;
      }

      if (!formatter) {
        results[channel] = { success: false, error: "No formatter configured for channel" };
        return;
      }

      const providerName = PROVIDER_NAME_MAP[channel] || "WhatsApp Notification Provider";
      const auto = automationsMap[providerName] || null;

      if (auto && auto.status === "disabled") {
        results[channel] = { success: false, error: `${providerName} is disabled` };
        return;
      }

      const startTime = Date.now();
      try {
        const payload = formatter(data);
        const res = await provider.send({ recipient, payload });
        results[channel] = { success: true, ...res };

        const duration = Date.now() - startTime;
        if (auto) {
          await mongoose.model("AutomationLog").create({
            automation: auto._id,
            eventName: type,
            automationType: channel,
            status: "success",
            processingDuration: duration,
            payload: { recipient, templateName: payload.templateName || "custom" },
          });
          
          await mongoose.model("Automation").updateOne(
            { _id: auto._id },
            {
              $set: { lastExecutedAt: new Date() },
              $inc: { successCount: 1 }
            }
          );
        }
      } catch (err) {
        console.error(`[NotificationService] Channel '${channel}' failed to send:`, err.message);
        results[channel] = { success: false, error: err.message };

        const duration = Date.now() - startTime;
        if (auto) {
          await mongoose.model("AutomationLog").create({
            automation: auto._id,
            eventName: type,
            automationType: channel,
            status: "failed",
            errorMessage: err.message,
            processingDuration: duration,
            payload: { recipient },
          });
          
          await mongoose.model("Automation").updateOne(
            { _id: auto._id },
            {
              $set: { lastExecutedAt: new Date() },
              $inc: { failureCount: 1 }
            }
          );
        }
      }
    });

    // Run all dispatches in parallel, ensuring no single channel crash halts others
    await Promise.all(dispatchPromises);

    const overallSuccess = Object.values(results).some((r) => r.success);

    return {
      success: overallSuccess,
      type,
      results,
    };
  },
};
