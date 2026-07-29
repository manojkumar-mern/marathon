import QRCode from "qrcode";
import puppeteer from "puppeteer";
import Certificate from "./certificate.model.js";
import CertificateTemplate from "./certificateTemplate.model.js";
import Registration from "../registration/registration.model.js";
import Result from "../result/result.model.js";
import { AppError } from "../../utils/AppError.js";
import { uploadFile } from "../../services/storage/storage.service.js";
import { notificationService } from "../../services/notification/notification.service.js";
import { NOTIFICATION_TYPES } from "../../services/notification/notification.types.js";
import { escapeRegExp } from "../../utils/regex.js";

// --- TEMPLATE MANAGEMENT SERVICES ---

export const createTemplate = async (data) => {
  if (data.isDefault) {
    // Turn off other defaults of the same type and same marathon
    await CertificateTemplate.updateMany(
      { type: data.type, marathon: data.marathon || null, isDefault: true },
      { isDefault: false }
    );
  }
  return await CertificateTemplate.create(data);
};

export const getAllTemplates = async (query = {}) => {
  const { type, marathon, page = 1, limit = 20 } = query;
  const filter = {};
  if (type) filter.type = type;
  if (marathon !== undefined) filter.marathon = marathon === "null" ? null : marathon;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (pageNum - 1) * limitNum;
  const [templates, total] = await Promise.all([
    CertificateTemplate.find(filter)
      .populate("marathon", "title slug eventDate")
      .skip(skip)
      .limit(limitNum)
      .lean(),
    CertificateTemplate.countDocuments(filter),
  ]);

  return {
    templates,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
};

export const getTemplateById = async (id) => {
  const template = await CertificateTemplate.findById(id).populate("marathon", "title slug eventDate").lean();
  if (!template) throw new AppError("Template not found", 404);
  return template;
};

export const updateTemplate = async (id, data) => {
  const template = await CertificateTemplate.findById(id);
  if (!template) throw new AppError("Template not found", 404);

  if (data.isDefault) {
    await CertificateTemplate.updateMany(
      { type: data.type || template.type, marathon: data.marathon !== undefined ? data.marathon : template.marathon, isDefault: true },
      { isDefault: false }
    );
  }

  Object.assign(template, data);
  await template.save();
  return template;
};

export const deleteTemplate = async (id) => {
  const template = await CertificateTemplate.findByIdAndDelete(id);
  if (!template) throw new AppError("Template not found", 404);
};

// --- CERTIFICATE CORE SERVICES ---

export const getAllCertificates = async (query = {}) => {
  const {
    page = 1, limit = 20, search = "", status, event, type, sort = "-createdAt",
  } = query;
  const filter = {};
  if (status) filter.status = status;
  if (event) filter.marathon = event;
  if (type) filter.type = type;
  if (search) {
    const escapedSearch = escapeRegExp(search);
    filter.$or = [
      { certificateNumber: { $regex: escapedSearch, $options: "i" } },
      { "participant.fullName": { $regex: escapedSearch, $options: "i" } },
      { bibNumber: { $regex: escapedSearch, $options: "i" } },
    ];
  }
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (pageNum - 1) * limitNum;
  const [certificates, total] = await Promise.all([
    Certificate.find(filter)
      .populate("marathon", "title slug eventDate")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Certificate.countDocuments(filter),
  ]);
  return {
    certificates, total,
    page: pageNum, limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
};

export const getCertificateById = async (id) => {
  const cert = await Certificate.findById(id)
    .populate("marathon", "title slug eventDate venue")
    .populate("registration", "registrationNumber status")
    .populate("template")
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

// Compile template replacing double brace placeholders
function compileTemplate(html, data) {
  let compiled = html;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    compiled = compiled.replace(regex, value !== undefined && value !== null ? value : "");
  }
  return compiled;
}

// Helper to launch Puppeteer and export PDF
async function generatePDFBuffer(html) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    return pdfBuffer;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export const getCertificateHTML = async (id, isPreview = false, previewData = null) => {
  let cert = null;
  let templateContent = "";

  if (isPreview) {
    cert = previewData;
  } else {
    cert = await Certificate.findById(id)
      .populate("marathon", "title slug eventDate venue")
      .populate("template")
      .lean();
    if (!cert) throw new AppError("Certificate not found", 404);
  }

  // Determine HTML Template
  if (cert.template?.htmlContent) {
    templateContent = cert.template.htmlContent;
  } else if (cert.templateId) {
    // For preview before saving
    const tempObj = await CertificateTemplate.findById(cert.templateId).lean();
    if (tempObj) templateContent = tempObj.htmlContent;
  }

  if (!templateContent) {
    // Retrieve Default Template from database
    const dbDefault = await CertificateTemplate.findOne({
      type: cert.type || "finisher",
      marathon: cert.marathon?._id || cert.marathon || null,
      isDefault: true,
    }).lean();

    if (dbDefault) {
      templateContent = dbDefault.htmlContent;
    } else {
      // Find global default template
      const globalDefault = await CertificateTemplate.findOne({
        type: cert.type || "finisher",
        marathon: null,
        isDefault: true,
      }).lean();
      if (globalDefault) {
        templateContent = globalDefault.htmlContent;
      }
    }
  }

  // Fallback to beautiful system default
  if (!templateContent) {
    templateContent = getDefaultHTMLTemplate(cert.type || "finisher");
  }

  const verifyUrl = getVerificationUrl(cert.certificateNumber || "TEMP-CERT");
  const qrDataUrl = cert.qrCode || await generateQR(cert.certificateNumber || "TEMP-CERT");
  const eventDate = cert.eventDate
    ? new Date(cert.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "—";
  const finishTimeStr = formatTime(cert.finishTime);

  const context = {
    fullName: cert.participant?.fullName || "Participant",
    marathonTitle: cert.marathon?.title || "Marathon Event",
    categoryName: cert.raceCategory?.name || "—",
    distance: cert.raceCategory?.distance || "—",
    bibNumber: cert.bibNumber || "—",
    finishTime: finishTimeStr,
    eventDate,
    certificateNumber: cert.certificateNumber || "TEMP-CERT",
    qrCode: qrDataUrl,
    verifyUrl,
    venue: cert.marathon?.venue?.name || "—",
  };

  return compileTemplate(templateContent, context);
};

// Generate certificates for a marathon (or single registration)
export const generateCertificates = async ({ marathonId, registrationId, type = "finisher", templateId }) => {
  let registrations = [];

  if (registrationId) {
    const reg = await Registration.findById(registrationId)
      .populate("marathon", "title eventDate venue")
      .lean();
    if (!reg) throw new AppError("Registration not found", 404);
    registrations = [reg];
  } else if (marathonId) {
    registrations = await Registration.find({
      marathon: marathonId,
      status: "confirmed",
      // Non-finishers can also get certificates (Participation, Volunteer, Organizer)
      ...(type === "finisher" || type === "winner" ? { isCompleted: true } : {}),
    })
      .populate("marathon", "title eventDate venue")
      .lean();
  } else {
    throw new AppError("Provide marathonId or registrationId", 400);
  }

  // Pick suitable template
  let selectedTemplate = null;
  if (templateId) {
    selectedTemplate = await CertificateTemplate.findById(templateId);
  } else {
    // Look for marathon-specific template first
    selectedTemplate = await CertificateTemplate.findOne({
      marathon: marathonId || registrations[0]?.marathon?._id,
      type,
      isActive: true,
    });
    if (!selectedTemplate) {
      // Look for global default template
      selectedTemplate = await CertificateTemplate.findOne({
        marathon: null,
        type,
        isDefault: true,
        isActive: true,
      });
    }
  }

  const created = [];
  const skipped = [];
  const errors = [];

  for (const reg of registrations) {
    // Duplicate prevention for same registration and type
    const existing = await Certificate.findOne({ registration: reg._id, type });
    if (existing) {
      skipped.push(reg._id);
      continue;
    }

    try {
      const resultObj = await Result.findOne({ registration: reg._id });
      if (!resultObj || !resultObj.isPublished) {
        throw new AppError("Cannot generate certificate: Results are not yet published.", 400);
      }

      const certData = {
        registration: reg._id,
        marathon: reg.marathon._id,
        type,
        template: selectedTemplate?._id || undefined,
        result: resultObj._id,
        participant: {
          fullName: reg.runnerDetails?.fullName,
          email: reg.runnerDetails?.email,
        },
        raceCategory: {
          name: reg.raceCategory?.name,
          distance: reg.raceCategory?.distance,
        },
        bibNumber: reg.bibNumber,
        finishTime: resultObj.chipTime || resultObj.gunTime || undefined,
        eventDate: reg.marathon?.eventDate,
        status: "pending",
      };

      const cert = await Certificate.create(certData);
      cert.qrCode = await generateQR(cert.certificateNumber);

      // Link result to this certificate
      resultObj.certificate = cert._id;
      await resultObj.save();

      // Generate HTML and PDF
      const html = await getCertificateHTML(cert._id);
      const pdfBuffer = await generatePDFBuffer(html);

      // Upload PDF to storage
      const uploadResult = await uploadFile(pdfBuffer, {
        folder: "certificates",
        filename: cert.certificateNumber,
      });

      cert.certificateUrl = uploadResult.secureUrl;
      cert.status = "generated";
      cert.generatedAt = new Date();
      await cert.save();

      // Integrate with the Notification Engine
      try {
        await notificationService.send({
          recipient: {
            email: cert.participant.email,
            phone: reg.runnerDetails?.phone,
          },
          type: NOTIFICATION_TYPES.CERTIFICATE_READY,
          data: {
            participantName: cert.participant.fullName,
            marathonName: reg.marathon.title,
            certificateUrl: cert.certificateUrl,
            verifyUrl: getVerificationUrl(cert.certificateNumber),
          },
        });
      } catch (notifErr) {
        console.error(`Failed to send notification for certificate ${cert.certificateNumber}:`, notifErr.message);
      }

      created.push(cert._id);
    } catch (err) {
      console.error(`Error generating certificate for registration ${reg._id}:`, err.message);
      errors.push({ registrationId: reg._id, error: err.message });
    }
  }

  return { generated: created.length, skipped: skipped.length, errors };
};

export const regenerateCertificate = async (id) => {
  const cert = await Certificate.findById(id)
    .populate("marathon", "title eventDate venue")
    .populate("registration", "runnerDetails")
    .populate("template");
  if (!cert) throw new AppError("Certificate not found", 404);

  // Recalculate QR Code
  cert.qrCode = await generateQR(cert.certificateNumber);

  // Fetch results in case they changed
  const result = await Result.findOne({ registration: cert.registration }).lean();
  if (result) {
    cert.finishTime = result.chipTime || result.gunTime;
  }

  // Generate HTML and PDF
  const html = await getCertificateHTML(cert._id);
  const pdfBuffer = await generatePDFBuffer(html);

  // Re-upload to storage
  const uploadResult = await uploadFile(pdfBuffer, {
    folder: "certificates",
    filename: cert.certificateNumber,
  });

  cert.certificateUrl = uploadResult.secureUrl;
  cert.status = "generated";
  cert.generatedAt = new Date();
  await cert.save();

  return cert;
};

export const deleteCertificate = async (id) => {
  const cert = await Certificate.findByIdAndDelete(id);
  if (!cert) throw new AppError("Certificate not found", 404);
};

export const sendCertificateEmail = async (id) => {
  const cert = await Certificate.findById(id)
    .populate("marathon", "title eventDate")
    .lean();
  if (!cert) throw new AppError("Certificate not found", 404);
  if (!cert.participant?.email) throw new AppError("No email address for this participant", 400);

  const verifyUrl = getVerificationUrl(cert.certificateNumber);
  const html = await getCertificateHTML(id);

  // Send through notification service
  await notificationService.send({
    recipient: { email: cert.participant.email },
    type: NOTIFICATION_TYPES.CERTIFICATE_READY,
    data: {
      participantName: cert.participant.fullName,
      marathonName: cert.marathon?.title || "Marathon Event",
      certificateUrl: cert.certificateUrl,
      verifyUrl,
    },
  });

  await Certificate.findByIdAndUpdate(id, { status: "emailed", emailedAt: new Date() });

  return { emailed: true, email: cert.participant.email };
};

export const verifyCertificate = async (certNumber) => {
  const cert = await Certificate.findOne({ certificateNumber: certNumber })
    .populate("marathon", "title eventDate venue")
    .populate("template")
    .lean();
  if (!cert) throw new AppError("Certificate not found or invalid", 404);
  return cert;
};

// --- DEFAULT SYSTEM HTML TEMPLATES FOR FALLBACK ---

function getDefaultHTMLTemplate(type) {
  let title = "Certificate of Completion";
  let subtitle = "for successfully completing the";
  let badge = "&#9733;";

  switch (type) {
    case "participation":
      title = "Certificate of Participation";
      subtitle = "for participating in the";
      badge = "&#9825;";
      break;
    case "winner":
      title = "Certificate of Victory";
      subtitle = "for securing a podium finish in the";
      badge = "&#127942;";
      break;
    case "volunteer":
      title = "Certificate of Appreciation";
      subtitle = "for volunteering and supporting the";
      badge = "&#10084;";
      break;
    case "organizer":
      title = "Certificate of Recognition";
      subtitle = "for organizing and coordinating the";
      badge = "&#128736;";
      break;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} - {{certificateNumber}}</title>
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
      <div class="badge">${badge}</div>
      <h1>${title}</h1>
      <p>Proudly Presented To</p>
    </div>
    <div class="divider"></div>
    <div class="body-text">
      <p class="name">{{fullName}}</p>
      <p class="detail">${subtitle}</p>
      <p class="event-name">{{marathonTitle}}</p>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Category</div>
          <div class="info-value">{{categoryName}} ({{distance}})</div>
        </div>
        <div class="info-item">
          <div class="info-label">Bib Number</div>
          <div class="info-value">{{bibNumber}}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Finish Time</div>
          <div class="info-value">{{finishTime}}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Date</div>
          <div class="info-value">{{eventDate}}</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="qr">
        <img src="{{qrCode}}" alt="QR Code" />
        <span>Scan to verify</span>
      </div>
      <div class="verify">
        <strong>{{certificateNumber}}</strong><br />
        <a href="{{verifyUrl}}" target="_blank">Verify Online</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export const getCertificateStatus = async (registrationId) => {
  const reg = await Registration.findById(registrationId).lean();
  if (!reg) throw new AppError("Registration not found", 404);

  const certificates = await Certificate.find({ registration: registrationId }).populate("template").lean();
  const result = await Result.findOne({ registration: registrationId }).lean();

  let eligibility = "not_eligible";
  let reason = "No race result found.";

  if (result) {
    if (result.isPublished) {
      eligibility = "eligible";
      reason = "Results are officially published. Certificate can be generated.";
    } else {
      eligibility = "pending_results_publish";
      reason = "Result exists, but official results are not yet published.";
    }
  } else {
    reason = "No official timing or result found for this registration.";
  }

  return {
    registrationId,
    hasCertificates: certificates.length > 0,
    certificates: certificates.map((c) => ({
      id: c._id,
      type: c.type,
      status: c.status,
      certificateUrl: c.certificateUrl,
      generatedAt: c.generatedAt,
    })),
    eligibility,
    reason,
    resultRecorded: !!result,
  };
};
