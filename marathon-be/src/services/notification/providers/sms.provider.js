export const smsProvider = {
  name: "sms",
  async send({ recipient, payload }) {
    if (!recipient.phone) {
      throw new Error("Missing recipient phone for SMS channel");
    }

    console.log("╔══════════════════════════════════════════════╗");
    console.log("║  SMS (dev mode — stub interface)            ║");
    console.log(`║  To:      ${recipient.phone}`);
    console.log(`║  Body:    ${typeof payload === "string" ? payload : JSON.stringify(payload)}`);
    console.log("╚══════════════════════════════════════════════╝");

    return {
      success: true,
      messageId: "mock-sms-id",
    };
  },
};
