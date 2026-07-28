import { n8n as n8nService } from "../../../automation/n8n.service.js";

export const whatsappProvider = {
  name: "whatsapp",
  async send({ recipient, payload }) {
    if (!recipient.phone) {
      throw new Error("Missing recipient phone for WhatsApp channel");
    }

    // Try sending via reusable n8n webhook or meta API config
    const response = await n8nService.sendRegistration({
      phone: recipient.phone,
      ...payload,
    });

    console.log(`[WhatsApp Provider] Dispatched message to ${recipient.phone}`);

    return {
      success: true,
      messageId: response?.messageId || "mock-whatsapp-id",
    };
  },
};
