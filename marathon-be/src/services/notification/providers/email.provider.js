import { sendEmailFn } from "../../email.service.js";

export const emailProvider = {
  name: "email",
  async send({ recipient, payload }) {
    if (!recipient.email) {
      throw new Error("Missing recipient email for email channel");
    }

    const { subject, templateName, context } = payload;

    // Simple HTML compilation for preview/fallback
    let html = payload.html;
    if (!html) {
      if (templateName === "certificate_ready") {
        html = `
          <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
            <h2>${subject}</h2>
            <p>Dear ${context.participantName || "Runner"},</p>
            <p>Congratulations on completing the event <strong>${context.marathonName}</strong>!</p>
            <p>Your certificate has been generated successfully.</p>
            <p>You can view and download your certificate here: <a href="${context.certificateUrl}" target="_blank">${context.certificateUrl}</a></p>
            <p>You can also verify the authenticity of your certificate at: <a href="${context.verifyUrl}" target="_blank">${context.verifyUrl}</a></p>
            <p>Best regards,<br/>The StrideForge Team</p>
          </div>
        `;
      } else {
        html = `
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
      }
    }

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
