import { n8n as n8nService } from "../../../automation/n8n.service.js";

export const whatsappProvider = {
  name: "whatsapp",
  async send({ recipient, payload }) {
    if (!recipient.phone) {
      throw new Error("Missing recipient phone for WhatsApp channel");
    }

    // Route to the correct webhook method based on templateName
    const templateName = payload.templateName;
    const data = { phone: recipient.phone, ...payload };
    let response;

    if (templateName === "registration_confirmation") {
      response = await n8nService.sendRegistration(data);
    } else if (templateName === "payment_success") {
      response = await n8nService.sendPaymentSuccess(data);
    } else if (templateName === "certificate_ready") {
      response = await n8nService.sendCertificate(data);
    } else if (templateName === "marketing") {
      response = await n8nService.sendMarketingCampaign(data);
    } else if (templateName === "event_reminder" || templateName === "race_day_reminder") {
      response = await n8nService.sendEventReminder(data);
    } else {
      // Fallback
      response = await n8nService.sendRegistration(data);
    }

    console.log(`[WhatsApp Provider] Dispatched message (${templateName || "default"}) to ${recipient.phone}`);

    return {
      success: true,
      messageId: response?.messageId || "mock-whatsapp-id",
    };
  },
};
