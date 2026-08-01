import axios from "axios";
import { env } from "../config/env.js";
import { Automation, AutomationLog } from "./automation.model.js";

function logError(context, error) {
  const msg = error?.response?.data
    ? typeof error.response.data === "string"
      ? error.response.data
      : JSON.stringify(error.response.data)
    : error.message;

  console.error(`[n8n] ${context} failed — ${msg}`);
}

async function sendToWebhook(endpoint, payload) {
  const baseUrl = env.n8nWebhookUrl;
  if (!baseUrl) {
    console.warn("[n8n] N8N_WEBHOOK_URL is not set — skipping automation");
    return null;
  }

  let auto = null;
  try {
    auto = await Automation.findOne({ name: "N8N Webhook Service" });
  } catch (err) {
    console.warn("[n8n] Automation model lookup failed — continuing default active behavior", err.message);
  }
  if (auto && auto.status === "disabled") {
    console.log("[n8n] N8N Webhook Service is disabled — skipping");
    return null;
  }

  const startTime = Date.now();
  try {
    const url = `${baseUrl.replace(/\/+$/, "")}/${endpoint}`;
    const { data } = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 10_000,
    });

    const duration = Date.now() - startTime;
    if (auto) {
      await AutomationLog.create({
        automation: auto._id,
        eventName: payload.event || endpoint.toUpperCase(),
        automationType: "webhook",
        status: "success",
        processingDuration: duration,
        payload,
      });
      auto.lastExecutedAt = new Date();
      auto.successCount += 1;
      await auto.save();
    }
    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    const msg = error?.response?.data
      ? typeof error.response.data === "string"
        ? error.response.data
        : JSON.stringify(error.response.data)
      : error.message;

    if (auto) {
      await AutomationLog.create({
        automation: auto._id,
        eventName: payload.event || endpoint.toUpperCase(),
        automationType: "webhook",
        status: "failed",
        errorMessage: msg,
        processingDuration: duration,
        payload,
      });
      auto.lastExecutedAt = new Date();
      auto.failureCount += 1;
      await auto.save();
    }

    logError(endpoint, error);
    return null;
  }
}

export const n8n = {
  async sendRegistration(data) {
    return sendToWebhook("registration", {
      event: "REGISTRATION_SUCCESS",
      timestamp: new Date().toISOString(),
      data,
    });
  },

  async sendPaymentSuccess(data) {
    return sendToWebhook("payment", {
      event: "PAYMENT_SUCCESS",
      timestamp: new Date().toISOString(),
      data,
    });
  },

  async sendCertificate(data) {
    return sendToWebhook("certificate", {
      event: "CERTIFICATE_READY",
      timestamp: new Date().toISOString(),
      data,
    });
  },

  async sendMarketingCampaign(data) {
    return sendToWebhook("marketing", {
      event: "MARKETING_CAMPAIGN",
      timestamp: new Date().toISOString(),
      data,
    });
  },

  async sendEventReminder(data) {
    return sendToWebhook("reminder", {
      event: "EVENT_REMINDER",
      timestamp: new Date().toISOString(),
      data,
    });
  },
};
