/**
 * create-admin.js
 * ───────────────
 * One-time script to upsert the admin user in the production database.
 *
 * Usage (Render Shell or local):
 *   node scripts/create-admin.js
 *
 * Reads MONGODB_URI from environment (or .env file).
 * Safe to run multiple times — uses findOneAndUpdate with upsert.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

dotenv.config();

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "vijaymanoj0000@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Thalpathi.1";
const ADMIN_NAME     = process.env.ADMIN_NAME     || "Vijay Manoj";
const ADMIN_PHONE    = process.env.ADMIN_PHONE    || "9000000001";

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error("MONGODB_URI is not set. Aborting.");
  process.exit(1);
}

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("Connected.");

  // Hash password with the same cost factor as the User model (12)
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const db = mongoose.connection.db;
  const collection = db.collection("users");

  const result = await collection.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    {
      $set: {
        fullName: ADMIN_NAME,
        email: ADMIN_EMAIL,
        phone: ADMIN_PHONE,
        password: hashedPassword,
        role: "admin",
        isActive: true,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  const action = result?._id ? "Updated existing" : "Created new";
  console.log(`Admin user ${action}:`);
  console.log(`  Email     : ${ADMIN_EMAIL}`);
  console.log(`  Role      : admin`);
  console.log(`  Database  : ${db.databaseName}`);
  console.log(`  Collection: users`);

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Script failed:", err.message);
  process.exit(1);
});
