export const pushProvider = {
  name: "push",
  async send({ recipient, payload }) {
    if (!recipient.fcmToken) {
      throw new Error("Missing recipient FCM token for Push notification channel");
    }

    console.log("╔══════════════════════════════════════════════╗");
    console.log("║  PUSH NOTIFICATION (dev mode — stub)        ║");
    console.log(`║  To Token: ${recipient.fcmToken}`);
    console.log(`║  Payload:  ${JSON.stringify(payload)}`);
    console.log("╚══════════════════════════════════════════════╝");

    return {
      success: true,
      messageId: "mock-push-id",
    };
  },
};
