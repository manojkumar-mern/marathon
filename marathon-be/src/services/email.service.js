import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { branding } from "../config/branding.js";
import {
  buildWelcomeEmail,
  buildRegistrationConfirmationEmail,
} from "./email.templates.js";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!env.smtpHost) {
    transporter = {
      sendMail: async (opts) => {
        console.log("╔══════════════════════════════════════════════╗");
        console.log("║  EMAIL (dev mode — no SMTP configured)      ║");
        console.log(`║  To:       ${opts.to}`);
        console.log(`║  Subject:  ${opts.subject}`);
        console.log("╚══════════════════════════════════════════════╝");
        return { messageId: "dev-mode" };
      },
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const from = `"${branding.appName}" <${env.emailFrom}>`;
    const info = await getTransporter().sendMail({ from, to, subject, html });
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("Failed to send email:", err.message);
  }
};

export const sendWelcomeEmail = async (user) => {
  const { html, subject } = buildWelcomeEmail({ fullName: user.fullName });
  return sendEmail({ to: user.email, subject, html });
};

export const sendRegistrationConfirmationEmail = async (
  user,
  registration,
  marathon
) => {
  const { html, subject } = buildRegistrationConfirmationEmail({
    fullName: user.fullName,
    registrationNumber: registration.registrationNumber,
    marathonTitle: marathon.title,
    eventDate: marathon.eventDate,
    categoryName: registration.raceCategory.name,
    venueName: marathon.venue?.name,
    venueCity: marathon.venue?.city,
  });
  return sendEmail({ to: user.email, subject, html });
};
