import mongoose from "mongoose";
import Registration from "../modules/registration/registration.model.js";
import Marathon from "../modules/marathon/marathon.model.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const indianNames = [
  "Arjun Krishnamurthy", "Priya Sundarajan", "Karthik Selvam", "Divya Rajan", "Venkat Narayanan",
  "Meera Balakrishnan", "Rahul Deshmukh", "Ananya Sharma", "Vikram Rathore", "Sneha Patel",
  "Rohit Verma", "Neha Gupta", "Amit Singh", "Pooja Joshi", "Suresh Kumar",
  "Lakshmi Nair", "Manoj Pillai", "Deepa Iyer", "Ravi Shankar", "Kavita Menon",
  "Ganesh Rao", "Shweta Reddy", "Aditya Choudhury", "Anjali Das", "Siddharth Bose",
  "Isha Saxena", "Pranav Kulkarni", "Nandita Mishra", "Dhruv Mehta", "Tanvi Agrawal",
  "Harsh Vardhan", "Ritu Jain", "Akash Malhotra", "Kriti Bhatia", "Varun Saxena",
  "Parul Srivastava", "Nikhil Tiwari", "Swati Pandey", "Abhishek Chauhan", "Rhea Kapoor",
  "Vivek Oberoi", "Aishwarya Nambiar", "Pradeep Reddy", "Shruti Varma", "Sandeep Nair",
  "Lalitha Krishnan", "Hariharan Subramanian", "Sindhu George", "Rajan Menon", "Jyoti Thakur",
];

const cities = [
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Salem", state: "Tamil Nadu" },
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Puducherry", state: "Puducherry" },
  { city: "Thiruvananthapuram", state: "Kerala" },
];

const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];
const tshirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const genders = ["male", "female", "other"];
const statuses = ["confirmed", "confirmed", "confirmed", "pending", "cancelled", "withdrawn"];

const streets = [
  "12, Gandhi Nagar", "45, Lake View Road", "8/3, Anna Salai", "67, Church Street",
  "23, MG Road", "91, Beach Road", "5, Temple Street", "15, North Street",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone() {
  return pick(["98765", "99887", "98410", "99440"]) + String(Math.floor(100000 + Math.random() * 900000));
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const TARGET = 50;

export async function autoSeed() {
  const count = await Registration.countDocuments();
  if (count >= TARGET) return;

  const needed = TARGET - count;
  console.log(`Found ${count} registrations — adding ${needed} more to reach ${TARGET}...`);

  const marathons = await Marathon.find().lean();
  if (marathons.length === 0) {
    console.log("No marathons found, skipping auto-seed.");
    return;
  }

  for (const marathon of marathons) {
    let modified = false;
    for (const cat of marathon.raceCategories) {
      if (!cat._id) {
        cat._id = new mongoose.Types.ObjectId();
        modified = true;
      }
    }
    if (modified) {
      await Marathon.updateOne(
        { _id: marathon._id },
        { $set: { raceCategories: marathon.raceCategories } }
      );
    }
  }

  let defaultUser = await User.findOne({ email: "default@marathon.local" });
  if (!defaultUser) {
    defaultUser = await User.create({
      fullName: "Default Runner",
      email: "default@marathon.local",
      password: process.env.DEFAULT_USER_PASSWORD || "password123",
      phone: "9999999999",
      role: "user",
    });
  }

  const existing = await Registration.find().select("runnerDetails.fullName").lean();
  const usedNames = new Set(existing.map((r) => r.runnerDetails?.fullName));
  const available = indianNames.filter((n) => !usedNames.has(n));

  const docs = [];
  for (let i = 0; i < needed; i++) {
    const marathon = pick(marathons);
    const category = pick(marathon.raceCategories);
    const name = available.length > 0 ? available[i % available.length] : `Runner ${count + i + 1}`;
    const phone = randomPhone();
    const gender = pick(genders);
    const cityObj = pick(cities);
    const daysAgo = Math.floor(Math.random() * 90);

    const categoryId = category._id || category.categoryId || new mongoose.Types.ObjectId();

    docs.push({
      marathon: marathon._id,
      user: defaultUser._id,
      raceCategory: {
        categoryId,
        name: category.name,
        distance: category.distance,
        price: category.price,
      },
      runnerDetails: {
        fullName: name,
        email: name.toLowerCase().replace(/\s+/g, ".") + "@example.com",
        phone,
        dateOfBirth: randomDate(new Date("1965-01-01"), new Date("2005-12-31")),
        gender,
      },
      emergencyContact: {
        fullName: pick(indianNames.filter((n) => n !== name)),
        phone: randomPhone(),
        relationship: pick(["Spouse", "Parent", "Sibling", "Friend"]),
      },
      tshirtSize: pick(tshirtSizes),
      address: {
        street: pick(streets),
        city: cityObj.city,
        state: cityObj.state,
        pincode: String(Math.floor(600000 + Math.random() * 100000)),
        country: "India",
      },
      medicalInfo: {
        hasMedicalConditions: Math.random() < 0.15,
        conditions: "",
        allergies: Math.random() < 0.2 ? pick(["Pollen", "Dust", "Peanuts"]) : "",
        bloodGroup: pick(bloodGroups),
      },
      payment: {
        amount: category.price,
        currency: "INR",
        method: pick(["razorpay", "stripe", "offline"]),
        transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        paidAt: Math.random() < 0.8 ? new Date(Date.now() - daysAgo * 86400000) : null,
        status: Math.random() < 0.8 ? "completed" : pick(["pending", "failed", "refunded"]),
      },
      status: pick(statuses),
      isCheckedIn: Math.random() < 0.3,
    });
  }

  await Registration.create(docs);
  console.log(`Added ${docs.length} sample participants (total: ${count + docs.length}).`);
}
