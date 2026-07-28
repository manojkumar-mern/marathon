import QRCode from "qrcode";
import Certificate from "./certificate.model.js";
import Registration from "../registration/registration.model.js";
import Result from "../result/result.model.js";
import { AppError } from "../../utils/AppError.js";
import { sendCertificateEmail as sendCertEmail } from "../../services/email.service.js";

export const getAllCertificates = async (query = {}) => {
  const {
    page = 1, limit = 20, search = "", status, event, sort = "-createdAt",
  } = query;
  const filter = {};
  if (status) filter.status = status;
  if (event) filter.marathon = event;
  if (search) {
    filter.$or = [
      { certificateNumber: { $regex: search, $options: "i" } },
      { "participant.fullName": { $regex: search, $options: "i" } },
      { bibNumber: { $regex: search, $options: "i" } },
    ];
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [certificates, total] = await Promise.all([
    Certificate.find(filter)
      .populate("marathon", "title slug eventDate")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Certificate.countDocuments(filter),
  ]);
  return {
    certificates, total,
    page: parseInt(page), limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
};

export const getCertificateById = async (id) => {
  const cert = await Certificate.findById(id)
    .populate("marathon", "title slug eventDate venue")
    .populate("registration", "registrationNumber status")
    .lean();
  if (!cert) throw new AppError("Certificate not found", 404);
  return cert;
};

function formatTime(seconds) {
  if (seconds == null) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function getVerificationUrl(certNumber) {
  const base = process.env.VERIFICATION_BASE_URL || "http://localhost:5000";
  return `${base}/api/certificates/verify/${certNumber}`;
}

async function generateQR(certNumber) {
  const url = getVerificationUrl(certNumber);
  try {
    return await QRCode.toDataURL(url, { width: 180, margin: 2, color: { dark: "#1a1a2e", light: "#ffffff" } });
  } catch {
    return null;
  }
}

// Generate certificates for all completed registrations of a marathon (or one registration)
export const generateCertificates = async ({ marathonId, registrationId }) => {
  let registrations = [];

  if (registrationId) {
    const reg = await Registration.findById(registrationId)
      .populate("marathon", "title eventDate")
      .lean();
    if (!reg) throw new AppError("Registration not found", 404);
    registrations = [reg];
  } else if (marathonId) {
    registrations = await Registration.find({
      marathon: marathonId,
      status: "confirmed",
      isCompleted: true,
    })
      .populate("marathon", "title eventDate")
      .lean();
  } else {
    throw new AppError("Provide marathonId or registrationId", 400);
  }

  const created = [];
  const skipped = [];

  for (const reg of registrations) {
    const existing = await Certificate.findOne({ registration: reg._id });
    if (existing) {
      skipped.push(reg._id);
      continue;
    }

    const result = await Result.findOne({ registration: reg._id }).lean();
    const certData = {
      registration: reg._id,
      marathon: reg.marathon._id,
      participant: {
        fullName: reg.runnerDetails?.fullName,
        email: reg.runnerDetails?.email,
      },
      raceCategory: {
        name: reg.raceCategory?.name,
        distance: reg.raceCategory?.distance,
      },
      bibNumber: reg.bibNumber,
      finishTime: result?.chipTime || result?.gunTime,
      eventDate: reg.marathon?.eventDate,
      status: "generated",
      generatedAt: new Date(),
    };

    const cert = await Certificate.create(certData);
    const verifyUrl = getVerificationUrl(cert.certificateNumber);
    cert.qrCode = await generateQR(cert.certificateNumber);
    await cert.save();

    created.push(cert._id);
  }

  return { generated: created.length, skipped: skipped.length };
};

export const regenerateCertificate = async (id) => {
  const cert = await Certificate.findById(id);
  if (!cert) throw new AppError("Certificate not found", 404);
  cert.status = "generated";
  cert.generatedAt = new Date();
  cert.certificateUrl = undefined;
  cert.qrCode = await generateQR(cert.certificateNumber);
  await cert.save();
  return cert;
};

export const deleteCertificate = async (id) => {
  const cert = await Certificate.findByIdAndDelete(id);
  if (!cert) throw new AppError("Certificate not found", 404);
};

export const getCertificateHTML = async (id) => {
  const cert = await Certificate.findById(id)
    .populate("marathon", "title slug eventDate venue")
    .lean();
  if (!cert) throw new AppError("Certificate not found", 404);

  const verifyUrl = getVerificationUrl(cert.certificateNumber);
  const qrDataUrl = cert.qrCode || await generateQR(cert.certificateNumber);
  const eventDate = cert.eventDate
    ? new Date(cert.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "—";
  const finishTime = formatTime(cert.finishTime);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Certificate of Completion - ${cert.certificateNumber}</title>
  <style>
    @page { margin: 0; size: landscape; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #f5f0eb; padding: 20px;
    }
    .certificate {
      width: 1050px; max-width: 100%;
      background: #fffdf9;
      border: 12px double #c8a76b;
      padding: 50px 60px;
      position: relative;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    .certificate::before {
      content: ''; position: absolute; inset: 12px;
      border: 1px solid #e8d5b5; pointer-events: none;
    }
    .header { text-align: center; margin-bottom: 32px; }
    .header .badge {
      display: inline-block; border: 2px solid #c8a76b;
      border-radius: 50%; width: 80px; height: 80px;
      line-height: 76px; font-size: 32px; margin-bottom: 12px;
      color: #c8a76b; font-family: 'Georgia', serif;
    }
    .header h1 {
      font-size: 42px; color: #1a1a2e; letter-spacing: 4px;
      text-transform: uppercase; font-weight: 700; margin-bottom: 4px;
    }
    .header p { font-size: 14px; color: #888; letter-spacing: 6px; text-transform: uppercase; }
    .divider {
      width: 200px; height: 2px; background: #c8a76b; margin: 24px auto;
    }
    .body-text { text-align: center; }
    .body-text .label {
      font-size: 16px; color: #666; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 6px;
    }
    .body-text .name {
      font-size: 44px; color: #1a1a2e; font-weight: 700; margin-bottom: 16px;
      font-family: 'Georgia', serif;
    }
    .body-text .detail { font-size: 18px; color: #444; margin-bottom: 4px; }
    .body-text .detail strong { color: #1a1a2e; }
    .body-text .event-name {
      font-size: 22px; color: #c8a76b; font-weight: 700; margin: 8px 0;
    }
    .info-grid {
      display: flex; justify-content: center; gap: 40px; margin: 24px 0; flex-wrap: wrap;
    }
    .info-grid .info-item { text-align: center; }
    .info-grid .info-item .info-label {
      font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 2px;
    }
    .info-grid .info-item .info-value {
      font-size: 18px; color: #1a1a2e; font-weight: 600; margin-top: 4px;
    }
    .footer {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-top: 32px; padding-top: 20px;
      border-top: 1px solid #e8d5b5;
    }
    .footer .qr { text-align: center; }
    .footer .qr img { width: 80px; height: 80px; display: block; }
    .footer .qr span { font-size: 9px; color: #999; }
    .footer .verify { font-size: 12px; color: #888; text-align: right; }
    .footer .verify a { color: #c8a76b; text-decoration: none; }
    .print-btn { display: block; margin: 20px auto; padding: 10px 30px;
      background: #1a1a2e; color: #fff; border: none; border-radius: 6px;
      font-size: 14px; cursor: pointer; font-family: sans-serif;
    }
    .print-btn:hover { background: #2a2a4e; }
    @media print { .print-btn { display: none; } body { padding: 0; background: #fff; }
      .certificate { box-shadow: none; border: 12px double #c8a76b; } }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="badge">&#9733;</div>
      <h1>Certificate of Completion</h1>
      <p>Proudly Presented To</p>
    </div>
    <div class="divider"></div>
    <div class="body-text">
      <p class="name">${cert.participant?.fullName || "Participant"}</p>
      <p class="detail">for successfully completing the</p>
      <p class="event-name">${cert.marathon?.title || "Marathon Event"}</p>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Category</div>
          <div class="info-value">${cert.raceCategory?.name || "—"} (${cert.raceCategory?.distance || "—"})</div>
        </div>
        <div class="info-item">
          <div class="info-label">Bib Number</div>
          <div class="info-value">${cert.bibNumber || "—"}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Finish Time</div>
          <div class="info-value">${finishTime}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Date</div>
          <div class="info-value">${eventDate}</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="qr">
        <img src="${qrDataUrl}" alt="QR Code" />
        <span>Scan to verify</span>
      </div>
      <div class="verify">
        <strong>${cert.certificateNumber || ""}</strong><br />
        <a href="${verifyUrl}" target="_blank">Verify Online</a>
      </div>
    </div>
  </div>
  <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
</body>
</html>`;
};

export const sendCertificateEmail = async (id) => {
  const cert = await Certificate.findById(id)
    .populate("marathon", "title eventDate")
    .lean();
  if (!cert) throw new AppError("Certificate not found", 404);
  if (!cert.participant?.email) throw new AppError("No email address for this participant", 400);

  const verifyUrl = getVerificationUrl(cert.certificateNumber);
  const html = await getCertificateHTML(id);

  await sendCertEmail({
    to: cert.participant.email,
    subject: `Your Certificate - ${cert.marathon?.title || "Marathon Event"}`,
    html: `<p>Dear ${cert.participant.fullName},</p>
<p>Congratulations on completing ${cert.marathon?.title || "the event"}!</p>
<p>Your certificate is attached below. You can also verify it online:</p>
<p><a href="${verifyUrl}">${verifyUrl}</a></p>
<p>Thank you for participating!</p>`,
  });

  cert.status = "emailed";
  cert.emailedAt = new Date();
  await Certificate.findByIdAndUpdate(id, { status: "emailed", emailedAt: new Date() });

  return { emailed: true, email: cert.participant.email };
};

export const verifyCertificate = async (certNumber) => {
  const cert = await Certificate.findOne({ certificateNumber: certNumber })
    .populate("marathon", "title eventDate venue")
    .lean();
  if (!cert) throw new AppError("Certificate not found or invalid", 404);
  return cert;
};
