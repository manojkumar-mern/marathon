/**
 * create-admin.js
 * ───────────────
 * Provides two entry points:
 *
 *  1. ensureAdminUser() — exported function.
 *     Assumes Mongoose is already connected. Used by server.js at startup.
 *     Does NOT connect/disconnect or call process.exit().
 *
 *  2. main() — CLI entry point (only runs when this file is executed directly).
 *     Handles its own connect/disconnect for `node scripts/create-admin.js`.
 *
 * Safe to run multiple times — checks for existing user before inserting.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

dotenv.config();

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "vijaymanoj0000@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Thalapathi.1";
const ADMIN_NAME     = process.env.ADMIN_NAME     || "Vijay Manoj";
const ADMIN_PHONE    = process.env.ADMIN_PHONE    || "9000000001";

/**
 * Ensures the admin user exists in the database.
 * Requires an active Mongoose connection before calling.
 * Never creates duplicates — checks first, inserts only if missing.
 */
export async function ensureAdminUser() {
  const collection = mongoose.connection.db.collection("users");

  const existing = await collection.findOne({ email: ADMIN_EMAIL });
  
  if (existing) {
    // Check if the existing password hash matches the intended password
    const isCorrectPassword = await bcrypt.compare(ADMIN_PASSWORD, existing.password);
    
    if (isCorrectPassword) {
      console.log("Admin password already up to date");
      return;
    }

    // Hash the new intended password with cost factor 12
    const hashedNewPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    
    await collection.updateOne(
      { _id: existing._id },
      { $set: { password: hashedNewPassword, updatedAt: new Date() } }
    );
    
    console.log("Admin password updated successfully");
    return;
  }

  // Hash the password with cost factor 12
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await collection.insertOne({
    fullName: ADMIN_NAME,
    email: ADMIN_EMAIL,
    phone: ADMIN_PHONE,
    password: hashedPassword,
    role: "admin",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("Admin created successfully");
}

// ── CLI entry point ──────────────────────────────────────────────────────────
// Only runs when this file is executed directly: node scripts/create-admin.js
const isMain =
  process.argv[1] &&
  (await import("url")).fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const MONGO_URI = process.env.MONGODB_URI;
  if (!MONGO_URI) {
    console.error("MONGODB_URI is not set. Aborting.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected.");

    await ensureAdminUser();

    await mongoose.disconnect();
    console.log("Done.");
  } catch (err) {
    console.error("Script failed:", err.message);
    process.exit(1);
  }
}
