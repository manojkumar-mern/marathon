import mongoose from "mongoose";
import { config } from "dotenv";
import bcrypt from "bcrypt";

config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

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
  { city: "Delhi", state: "Delhi" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Madurai", state: "Tamil Nadu" },
  { city: "Puducherry", state: "Puducherry" },
  { city: "Thiruvananthapuram", state: "Kerala" },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const tshirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const genders = ["male", "female", "other"];
const statuses = ["pending", "confirmed", "confirmed", "confirmed", "confirmed", "cancelled", "withdrawn"];

const streets = [
  "12, Gandhi Nagar", "45, Lake View Road", "8/3, Anna Salai", "67, Church Street",
  "23, MG Road", "91, Beach Road", "5, Temple Street", "34, Park Avenue",
  "78, Main Road", "15, North Street", "56, South Extension", "102, Ring Road",
];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone() {
  const prefixes = ["98765", "99887", "98760", "87654", "76543", "98940", "98410", "99440"];
  return randomPick(prefixes) + String(Math.floor(100000 + Math.random() * 900000));
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const Registration = mongoose.model("Registration");
  const existing = await Registration.countDocuments();
  if (existing > 0) {
    console.log(`Registrations collection already has ${existing} document(s) — skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  console.log("Fetching marathons...");
  const Marathon = mongoose.model("Marathon");
  const marathons = await Marathon.find().lean();
  if (marathons.length === 0) {
    console.log("No marathons found. Run `npm run seed` first to seed marathons.");
    await mongoose.disconnect();
    process.exit(1);
  }

  const User = mongoose.model("User");
  const hashedPassword = await bcrypt.hash("password123", 12);

  const userIds = [];
  for (let i = 0; i < 50; i++) {
    const name = indianNames[i];
    const email = name.toLowerCase().replace(/\s+/g, ".") + "@example.com";
    const phone = randomPhone();
    const user = await User.create({
      fullName: name,
      email,
      password: hashedPassword,
      phone,
      role: "user",
    });
    userIds.push(user._id);
  }
  console.log(`Created ${userIds.length} sample users.`);

  const registrations = [];
  for (let i = 0; i < 50; i++) {
    const marathon = randomPick(marathons);
    const category = randomPick(marathon.raceCategories);
    const daysBeforeEnd = Math.floor(Math.random() * 60);
    const createdAt = new Date(Date.now() - daysBeforeEnd * 86400000);
    const gender = randomPick(genders);
    const cityObj = randomPick(cities);
    const name = indianNames[i];
    const phone = randomPhone();

    registrations.push({
      marathon: marathon._id,
      user: userIds[i],
      raceCategory: {
        categoryId: category._id || category.categoryId,
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
        fullName: randomPick(indianNames.filter((n) => n !== name)),
        phone: randomPhone(),
        relationship: randomPick(["Spouse", "Parent", "Sibling", "Friend"]),
      },
      tshirtSize: randomPick(tshirtSizes),
      address: {
        street: randomPick(streets),
        city: cityObj.city,
        state: cityObj.state,
        pincode: String(Math.floor(600000 + Math.random() * 100000)),
        country: "India",
      },
      medicalInfo: {
        hasMedicalConditions: Math.random() < 0.15,
        conditions: "",
        allergies: Math.random() < 0.2 ? randomPick(["Pollen", "Dust", "Peanuts", "None"]) : "",
        bloodGroup: randomPick(bloodGroups),
      },
      payment: {
        amount: category.price,
        currency: "INR",
        method: randomPick(["razorpay", "stripe", "offline"]),
        transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        paidAt: Math.random() < 0.8 ? createdAt : null,
        status: Math.random() < 0.8 ? "completed" : randomPick(["pending", "failed", "refunded"]),
      },
      status: randomPick(statuses),
      isCheckedIn: Math.random() < 0.3,
      createdAt,
      updatedAt: createdAt,
    });
  }

  await Registration.create(registrations);
  console.log(`Seeded ${registrations.length} registrations into the database.`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
