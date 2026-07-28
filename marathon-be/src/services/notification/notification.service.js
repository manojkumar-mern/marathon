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

      try {
        const payload = formatter(data);
        const res = await provider.send({ recipient, payload });
        results[channel] = { success: true, ...res };
      } catch (err) {
        console.error(`[NotificationService] Channel '${channel}' failed to send:`, err.message);
        results[channel] = { success: false, error: err.message };
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
