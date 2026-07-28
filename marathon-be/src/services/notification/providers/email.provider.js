import { sendEmailFn } from "../../email.service.js";

export const emailProvider = {
  name: "email",
  async send({ recipient, payload }) {
    if (!recipient.email) {
      throw new Error("Missing recipient email for email channel");
    }

    const { subject, templateName, context } = payload;

    // Simple HTML compilation for preview/fallback
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>${subject}</h2>
        <p>Hi ${context.participantName || "Runner"},</p>
        <p>This is a confirmation for <strong>${context.marathonName}</strong>.</p>
        <ul>
          <li><strong>Registration ID:</strong> ${context.registrationId || "N/A"}</li>
          <li><strong>Date:</strong> ${context.eventDate || "N/A"}</li>
          <li><strong>Status:</strong> ${context.paymentStatus || "N/A"}</li>
        </ul>
      </div>
    `;

    const info = await sendEmailFn({
      to: recipient.email,
      subject,
      html,
    });

    return {
      success: !!info,
      messageId: info?.messageId || null,
    };
  },
};
