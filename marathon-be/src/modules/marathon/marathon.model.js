import mongoose from "mongoose";

const raceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    distance: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["easy", "moderate", "hard", "extreme"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    maxParticipants: { type: Number, required: true, min: 1 },
    startTime: { type: String, required: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const venueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, default: "India" },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false }
);

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, trim: true },
    website: { type: String, trim: true },
    tier: {
      type: String,
      enum: ["platinum", "gold", "silver", "bronze", "partner"],
      default: "partner",
    },
  },
  { _id: true }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: true }
);

const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    metaKeywords: [{ type: String, trim: true }],
  },
  { _id: false }
);

const marathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Marathon title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    description: { type: String, trim: true },
    eventDate: { type: Date, required: [true, "Event date is required"] },
    registrationStartDate: {
      type: Date,
      required: [true, "Registration start date is required"],
    },
    registrationEndDate: {
      type: Date,
      required: [true, "Registration end date is required"],
    },
    venue: { type: venueSchema, required: true },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    bannerImage: { type: String, trim: true },
    galleryImages: [{ type: String, trim: true }],
    raceCategories: [raceCategorySchema],
    organizer: { type: String, trim: true },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contactPhone: { type: String, trim: true },
    rules: [{ type: String, trim: true }],
    faqs: [faqSchema],
    sponsors: [sponsorSchema],
    status: {
      type: String,
      enum: ["draft", "published", "completed", "cancelled"],
      default: "draft",
    },
    featured: { type: Boolean, default: false },
    seo: { type: seoSchema },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

marathonSchema.index({ status: 1, eventDate: -1 });
marathonSchema.index({ "venue.city": 1, status: 1 });
marathonSchema.index({ featured: 1, status: 1 });
marathonSchema.index({ title: "text", shortDescription: "text" });

marathonSchema.pre("validate", function () {
  if (this.isModified("title") && !this.isModified("slug")) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    this.slug = baseSlug;
  }
});

const Marathon = mongoose.model("Marathon", marathonSchema);

export default Marathon;
