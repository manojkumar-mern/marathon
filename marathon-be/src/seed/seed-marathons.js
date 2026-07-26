import mongoose from "mongoose";
import { config } from "dotenv";

config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

const raceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    distance: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ["easy", "moderate", "hard", "extreme"], required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    maxParticipants: { type: Number, required: true, min: 1 },
    startTime: { type: String, required: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const venueSchema = new mongoose.Schema(
  { name: { type: String, required: true }, city: { type: String, required: true }, state: { type: String, required: true }, country: { type: String, default: "India" } },
  { _id: false }
);

const marathonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, trim: true },
    description: { type: String, trim: true },
    eventDate: { type: Date, required: true },
    registrationStartDate: { type: Date, required: true },
    registrationEndDate: { type: Date, required: true },
    venue: { type: venueSchema, required: true },
    bannerImage: { type: String, trim: true },
    raceCategories: [raceCategorySchema],
    status: { type: String, enum: ["draft", "published", "completed", "cancelled"], default: "draft" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

marathonSchema.pre("validate", function () {
  if (this.isModified("title") && !this.isModified("slug")) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
});

const Marathon = mongoose.model("Marathon", marathonSchema);

const seedMarathons = [
  {
    title: "Chennai Marina 42K",
    shortDescription: "Run along one of the world's longest urban beaches at sunrise.",
    description: "Run along one of the world's longest urban beaches at sunrise. The Chennai Marina 42K takes you through the heart of the city — past iconic landmarks, cheering crowds, and the open sea. Whether you are chasing a personal best or crossing your first finish line, this is the race to remember.",
    eventDate: new Date("2027-01-18"),
    registrationStartDate: new Date("2026-09-01"),
    registrationEndDate: new Date("2027-01-05"),
    venue: { name: "Marina Beach", city: "Chennai", state: "Tamil Nadu", country: "India" },
    raceCategories: [
      { name: "Full Marathon", distance: "42K", difficulty: "extreme", price: 2499, currency: "INR", maxParticipants: 500, startTime: "5:30 AM", description: "The iconic distance.", isActive: true },
      { name: "Half Marathon", distance: "21K", difficulty: "hard", price: 1499, currency: "INR", maxParticipants: 1000, startTime: "6:00 AM", description: "The sweet spot between endurance and speed.", isActive: true },
      { name: "10K", distance: "10K", difficulty: "moderate", price: 999, currency: "INR", maxParticipants: 1500, startTime: "6:30 AM", description: "A step up that rewards consistent training.", isActive: true },
      { name: "5K Sprint", distance: "5K", difficulty: "easy", price: 799, currency: "INR", maxParticipants: 2000, startTime: "7:00 AM", description: "Fast-paced and full of crowd energy.", isActive: true },
    ],
    status: "published",
    featured: true,
  },
  {
    title: "Salem Yercaud Run",
    shortDescription: "A scenic run starting from the foothills of Yercaud.",
    description: "A scenic run starting from the foothills of Yercaud. The Salem edition offers a unique blend of rural charm and energetic city crowds. The gentle elevation makes it perfect for runners looking for a course with character.",
    eventDate: new Date("2027-02-22"),
    registrationStartDate: new Date("2026-10-01"),
    registrationEndDate: new Date("2027-02-08"),
    venue: { name: "Yercaud Foothills", city: "Salem", state: "Tamil Nadu", country: "India" },
    raceCategories: [
      { name: "10K", distance: "10K", difficulty: "moderate", price: 999, currency: "INR", maxParticipants: 1000, startTime: "6:30 AM", description: "A step up that rewards consistent training.", isActive: true },
      { name: "5K Sprint", distance: "5K", difficulty: "easy", price: 799, currency: "INR", maxParticipants: 1500, startTime: "7:00 AM", description: "Fast-paced and full of crowd energy.", isActive: true },
    ],
    status: "published",
    featured: false,
  },
  {
    title: "Bengaluru Cubbon Half",
    shortDescription: "Run through Bengaluru's green heart.",
    description: "Run through Bengaluru's green heart. The Cubbon Half takes you along shaded boulevards and heritage roads in one of India's most vibrant cities. The cool morning air and enthusiastic city crowd make this a favourite among runners returning year after year.",
    eventDate: new Date("2027-03-08"),
    registrationStartDate: new Date("2026-11-01"),
    registrationEndDate: new Date("2027-02-20"),
    venue: { name: "Cubbon Park", city: "Bengaluru", state: "Karnataka", country: "India" },
    raceCategories: [
      { name: "Half Marathon", distance: "21K", difficulty: "hard", price: 1499, currency: "INR", maxParticipants: 1000, startTime: "6:00 AM", description: "The sweet spot between endurance and speed.", isActive: true },
      { name: "10K", distance: "10K", difficulty: "moderate", price: 999, currency: "INR", maxParticipants: 1500, startTime: "6:30 AM", description: "A step up that rewards consistent training.", isActive: true },
      { name: "5K Sprint", distance: "5K", difficulty: "easy", price: 799, currency: "INR", maxParticipants: 2000, startTime: "7:00 AM", description: "Fast-paced and full of crowd energy.", isActive: true },
    ],
    status: "published",
    featured: false,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const existing = await Marathon.countDocuments();
  if (existing > 0) {
    console.log(`Marathons collection already has ${existing} document(s) — skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  await Marathon.create(seedMarathons);
  console.log(`Seeded ${seedMarathons.length} marathons into the database.`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
