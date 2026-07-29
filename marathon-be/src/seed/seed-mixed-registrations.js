import mongoose from "mongoose";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import Marathon from "../modules/marathon/marathon.model.js";
import Registration from "../modules/registration/registration.model.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Result from "../modules/result/result.model.js";
import Certificate from "../modules/certificate/certificate.model.js";

config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedMarathons = [
  {
    title: "Chennai Marina 42K",
    shortDescription: "Run along one of the world's longest urban beaches at sunrise.",
    description: "The Chennai Marina 42K takes you through the heart of the city — past iconic landmarks, cheering crowds, and the open sea. Whether you are chasing a personal best or crossing your first finish line, this is the race to remember.",
    eventDate: new Date("2027-01-18"),
    registrationStartDate: new Date("2026-09-01"),
    registrationEndDate: new Date("2027-01-05"),
    venue: { name: "Marina Beach", city: "Chennai", state: "Tamil Nadu", country: "India" },
    bannerImage: "https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=1000",
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
    bannerImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1000",
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
    bannerImage: "https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=1000",
    raceCategories: [
      { name: "Half Marathon", distance: "21K", difficulty: "hard", price: 1499, currency: "INR", maxParticipants: 1000, startTime: "6:00 AM", description: "The sweet spot between endurance and speed.", isActive: true },
      { name: "10K", distance: "10K", difficulty: "moderate", price: 999, currency: "INR", maxParticipants: 1500, startTime: "6:30 AM", description: "A step up that rewards consistent training.", isActive: true },
      { name: "5K Sprint", distance: "5K", difficulty: "easy", price: 799, currency: "INR", maxParticipants: 2000, startTime: "7:00 AM", description: "Fast-paced and full of crowd energy.", isActive: true },
    ],
    status: "published",
    featured: false,
  },
];

const names = [
  "Arjun Sharma", "Priya Nair", "Aditya Sen", "Ananya Rao", "Karthik Raj",
  "Meera Patel", "Rahul Gupta", "Neha Verma", "Siddharth Das", "Ritu Jain",
  "Vikram Singh", "Sneha Iyer", "Rohan Mehta", "Divya Pillai", "Amit Kumar",
  "Pooja Joshi", "Sanjay Dutt", "Kavita Reddy", "Harish Rao", "Swati Bose"
];

const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-"];
const tshirtSizes = ["S", "M", "L", "XL"];
const genders = ["male", "female"];

async function seed() {
  console.log("Connecting to database...");
  await mongoose.connect(MONGODB_URI);

  console.log("Cleaning up old data...");
  await Registration.deleteMany({});
  await Payment.deleteMany({});
  await Result.deleteMany({});
  await Certificate.deleteMany({});
  await Marathon.deleteMany({});

  // Clean up users with user role (preserve admin accounts if any)
  await User.deleteMany({ role: "user" });

  console.log("Seeding marathons with banner images...");
  const marathons = await Marathon.create(seedMarathons);
  console.log(`Seeded ${marathons.length} marathons successfully.`);

  const hashedPassword = await bcrypt.hash("password123", 12);

  console.log("Seeding 20 mixed participants...");
  for (let i = 0; i < 20; i++) {
    const fullName = names[i];
    const email = fullName.toLowerCase().replace(/\s+/g, ".") + "@example.com";
    const gender = genders[i % genders.length];
    
    // Create user account
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone: `9876543${String(i).padStart(3, "0")}`,
      role: "user",
    });

    const marathon = marathons[i % marathons.length];
    const category = marathon.raceCategories[i % marathon.raceCategories.length];

    // Determine states combinations
    let registrationStatus = "pending";
    let paymentStatus = "pending";
    let isCompleted = false;

    if (i < 10) {
      // 10 fully confirmed and completed
      registrationStatus = "confirmed";
      paymentStatus = "completed";
      isCompleted = i % 2 === 0; // Some are complete (eligible for certificate/results)
    } else if (i < 15) {
      // 5 confirmed registration with pending/offline payment
      registrationStatus = "confirmed";
      paymentStatus = "pending";
    } else if (i < 18) {
      // 3 pending registrations
      registrationStatus = "pending";
      paymentStatus = "pending";
    } else {
      // 2 cancelled
      registrationStatus = "cancelled";
      paymentStatus = "failed";
    }

    const reg = await Registration.create({
      marathon: marathon._id,
      user: user._id,
      registrationNumber: `REG-2026-${String(i+1).padStart(5, "0")}`,
      status: registrationStatus,
      isCompleted,
      raceCategory: {
        categoryId: category._id,
        name: category.name,
        distance: category.distance,
        price: category.price,
      },
      runnerDetails: {
        fullName,
        email,
        phone: user.phone,
        dateOfBirth: new Date(1990 + (i % 15), i % 12, (i * 7) % 28 + 1),
        gender,
      },
      emergencyContact: {
        fullName: `Emergency Contact ${i}`,
        phone: "9999999999",
        relationship: "Friend",
      },
      tshirtSize: tshirtSizes[i % tshirtSizes.length],
      address: {
        street: "123 Run Road",
        city: marathon.venue.city,
        state: marathon.venue.state,
        pincode: "600001",
        country: "India",
      },
      medicalInfo: {
        bloodGroup: bloodGroups[i % bloodGroups.length],
      },
      payment: {
        amount: category.price,
        currency: "INR",
        method: "razorpay",
        transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        paidAt: paymentStatus === "completed" ? new Date() : null,
        status: paymentStatus,
      },
    });

    // If payment status is completed, create a matching Payment document
    if (paymentStatus === "completed") {
      await Payment.create({
        user: user._id,
        marathon: marathon._id,
        registration: reg._id,
        amount: category.price,
        status: "paid",
        transactionId: reg.payment.transactionId,
        receipt: `REC-${reg.payment.transactionId}`,
        paidAt: new Date(),
      });
    }

    // Seed result for completed confirmed runners
    if (isCompleted) {
      await Result.create({
        registration: reg._id,
        marathon: marathon._id,
        registrationNumber: reg.registrationNumber,
        bibNumber: `B-${1000 + i}`,
        runnerDetails: {
          fullName,
          email,
        },
        raceCategory: {
          name: category.name,
          distance: category.distance,
        },
        chipTime: 3600 + (i * 120), // staggered times
        gunTime: 3610 + (i * 120),
        finishStatus: "Completed",
        isPublished: false,
      });
    }
  }

  console.log("Seeding complete. Seeded 20 mixed participants.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
