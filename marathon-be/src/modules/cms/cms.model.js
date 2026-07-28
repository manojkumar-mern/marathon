import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    content: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    isHomepage: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    linkUrl: { type: String, default: "" },
    linkLabel: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    placement: { type: String, enum: ["top", "bottom", "modal"], default: "top" },
    startsAt: { type: Date },
    endsAt: { type: Date },
  },
  { timestamps: true }
);

export const Page = mongoose.model("Page", pageSchema);
export const Announcement = mongoose.model("Announcement", announcementSchema);
