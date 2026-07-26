import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI", "JWT_SECRET"];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `Missing required environment variables: ${missing.join(", ")}`
  );
  process.exit(1);
}

export const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV !== "production",

  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: parseInt(process.env.SMTP_PORT, 10) || 587,
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  emailFrom: process.env.EMAIL_FROM || "noreply@example.com",

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:3000",

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",

  uploadMaxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
};
