import mongoose from "mongoose";

const certificateTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["participation", "finisher", "winner", "volunteer", "organizer"],
      required: [true, "Template type is required"],
    },
    htmlContent: {
      type: String,
      required: [true, "HTML content is required"],
    },
    placeholders: {
      type: [String],
      default: ["fullName", "marathonTitle", "categoryName", "bibNumber", "finishTime", "eventDate", "certificateNumber", "qrCode"],
    },
    marathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marathon",
      default: null,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index to ensure unique templates or default per type
certificateTemplateSchema.index({ type: 1, isDefault: 1, marathon: 1 }, { unique: true, partialFilterExpression: { isDefault: true } });

const CertificateTemplate = mongoose.model("CertificateTemplate", certificateTemplateSchema);

export default CertificateTemplate;
