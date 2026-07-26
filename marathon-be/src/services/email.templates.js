import { branding } from "../config/branding.js";

const {
  appName,
  companyName,
  supportEmail,
  website,
  logo,
  primaryColor,
  copyright,
  emailFooter,
  locale,
} = branding;

const baseStyle = `
  body { margin:0; padding:0; background:#f4f4f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
  .container { max-width:600px; margin:0 auto; padding:24px 16px; }
  .card { background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
  .header { background:${primaryColor}; padding:32px 24px; text-align:center; }
  .header h1 { color:#fff; margin:0; font-size:22px; font-weight:600; }
  .body { padding:32px 24px; color:#374151; font-size:15px; line-height:1.6; }
  .body h2 { color:#111827; font-size:18px; margin:0 0 16px; }
  .details { background:#f9fafb; border-radius:6px; padding:16px; margin:16px 0; }
  .details td { padding:6px 12px; font-size:14px; }
  .details td:first-child { color:#6b7280; white-space:nowrap; }
  .footer { text-align:center; padding:24px; color:#9ca3af; font-size:13px; line-height:1.5; }
  .btn { display:inline-block; padding:12px 28px; background:${primaryColor}; color:#fff; text-decoration:none; border-radius:6px; font-size:14px; font-weight:500; }
  hr { border:none; border-top:1px solid #e5e7eb; margin:24px 0; }
`;

const baseHtml = (content) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>${baseStyle}</style></head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        ${logo ? `<img src="${logo}" alt="${appName}" style="max-height:48px;margin-bottom:8px;">` : ""}
        <h1>${appName}</h1>
      </div>
      <div class="body">${content}</div>
    </div>
    <div class="footer">
      <p>${emailFooter}</p>
      <p><a href="${website}" style="color:${primaryColor};text-decoration:none;">${website}</a></p>
      <p>${copyright} ${companyName}</p>
    </div>
  </div>
</body>
</html>`;

export const buildWelcomeEmail = ({ fullName }) => {
  const subject = `Welcome to ${appName} — Registration Successful`;
  const content = `
    <h2>Welcome, ${fullName}!</h2>
    <p>Thank you for creating an account with ${appName}. You now have access to browse marathons, register for events, and track your race history.</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${website}/marathons" class="btn">Browse Marathons</a>
    </p>
    <hr>
    <p style="font-size:14px;color:#6b7280;">Need help? Contact us at <a href="mailto:${supportEmail}" style="color:${primaryColor};">${supportEmail}</a>.</p>
  `;
  return { subject, html: baseHtml(content) };
};

export const buildRegistrationConfirmationEmail = ({
  fullName,
  registrationNumber,
  marathonTitle,
  eventDate,
  categoryName,
  venueName,
  venueCity,
}) => {
  const subject = `Registration Confirmed — ${marathonTitle}`;
  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "TBD";
  const content = `
    <h2>Registration Confirmed!</h2>
    <p>Dear <strong>${fullName}</strong>,</p>
    <p>Your registration for <strong>${marathonTitle}</strong> has been received successfully.</p>
    <div class="details">
      <table>
        <tr><td>Registration No.</td><td><strong>${registrationNumber}</strong></td></tr>
        <tr><td>Event</td><td>${marathonTitle}</td></tr>
        <tr><td>Category</td><td>${categoryName}</td></tr>
        <tr><td>Date</td><td>${formattedDate}</td></tr>
        ${venueName ? `<tr><td>Venue</td><td>${venueName}${venueCity ? `, ${venueCity}` : ""}</td></tr>` : ""}
      </table>
    </div>
    <p style="text-align:center;margin:24px 0;">
      <a href="${website}/my-registrations" class="btn">View My Registrations</a>
    </p>
    <hr>
    <p style="font-size:14px;color:#6b7280;">For any queries, reach out to <a href="mailto:${supportEmail}" style="color:${primaryColor};">${supportEmail}</a>.</p>
  `;
  return { subject, html: baseHtml(content) };
};
