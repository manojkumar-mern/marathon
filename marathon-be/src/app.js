import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { mongoSanitize } from "./middleware/sanitize.js";

import authRoutes from "./routes/auth.js";
import marathonRoutes from "./modules/marathon/marathon.routes.js";
import registrationRoutes from "./modules/registration/registration.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import resultRoutes from "./modules/result/result.routes.js";
import certificateRoutes from "./modules/certificate/certificate.routes.js";
import cmsRoutes from "./modules/cms/cms.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { env } from "./config/env.js";

const app = express();

const corsOptions = {
  origin: env.corsOrigin
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan(env.isProduction ? "combined" : "dev"));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Please try again later." },
});
app.use("/api/auth", authLimiter);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction ? 5000 : 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});
app.use("/api", apiLimiter);

app.use(
  express.json({
    limit: "10kb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(mongoSanitize);

app.use("/api/auth", authRoutes);
app.use("/api/marathons", marathonRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/cms", cmsRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: env.nodeEnv,
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
