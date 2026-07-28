import axios from "axios";
import { env } from "../config/env.js";

const BASE_URL = env.n8nWebhookUrl;

function logError(context, error) {
  const msg = error?.response?.data
    ? typeof error.response.data === "string"
      ? error.response.data
      : JSON.stringify(error.response.data)
    : error.message;

  console.error(`[n8n] ${context} failed — ${msg}`);
}

async function sendToWebhook(endpoint, payload) {
  if (!BASE_URL) {
    console.warn("[n8n] N8N_WEBHOOK_URL is not set — skipping automation");
    return null;
  }

  try {
    const url = `${BASE_URL.replace(/\/+$/, "")}/${endpoint}`;
    const { data } = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 10_000,
    });
    return data;
  } catch (error) {
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
