import "dotenv/config";
import mongoose from "mongoose";
import Registration from "../src/modules/registration/registration.model.js";
import User from "../src/models/User.js";
import Marathon from "../src/modules/marathon/marathon.model.js";
import ZohoSyncLog from "../src/models/ZohoSyncLog.js";
import { syncParticipantDirect, verifyConnection } from "../src/services/zoho.service.js";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment.");
  process.exit(1);
}

async function runTests() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully.\n");

  const results = {
    connection: false,
    registrationSaved: false,
    zohoSyncSuccess: false,
    mappedFieldsChecked: false,
    duplicateContactHandling: false,
    failureHandling: false,
    retryLogic: false,
    syncLogStorage: false,
  };

  try {
    // 1. Verify Connection to Zoho CRM
    console.log("--- Task 1: Verify Connection to Zoho CRM ---");
    const connectionInfo = await verifyConnection();
    console.log("Connection result:", connectionInfo);
    if (connectionInfo.connected) {
      console.log("✅ Zoho CRM Connection OK");
      results.connection = true;
    } else {
      console.warn("⚠️ Zoho CRM Connection Failed, check credentials.");
    }

    // Prepare helper data: Find/Create a Marathon
    let marathon = await Marathon.findOne({ title: "Test Marathon E2E" });
    if (marathon) {
      await Marathon.deleteOne({ _id: marathon._id });
    }
    
    console.log("Seeding a temporary marathon with multiple categories...");
    marathon = await Marathon.create({
      title: "Test Marathon E2E",
      shortDescription: "Short description",
      description: "Full description",
      eventDate: new Date("2027-12-01"),
      registrationStartDate: new Date("2026-01-01"),
      registrationEndDate: new Date("2027-11-01"),
      venue: { name: "Stadium", city: "Test City", state: "State", country: "India" },
      raceCategories: [
        { name: "10K", distance: "10K", difficulty: "moderate", price: 500, currency: "INR", startTime: "6:30 AM", maxParticipants: 1000 },
        { name: "5K Sprint", distance: "5K", difficulty: "easy", price: 300, currency: "INR", startTime: "7:00 AM", maxParticipants: 1000 },
        { name: "Full Marathon", distance: "42K", difficulty: "extreme", price: 1000, currency: "INR", startTime: "5:30 AM", maxParticipants: 1000 }
      ],
      status: "published",
    });

    // Find/Create a User
    await User.deleteMany({
      $or: [
        { email: "zoho.e2e.test@example.com" },
        { phone: "9988776655" },
        { email: "zoho.fail.test@example.com" }
      ]
    });

    let user = await User.create({
      fullName: "Zoho Test Runner",
      email: "zoho.e2e.test@example.com",
      phone: "9988776655",
      password: "password123",
      role: "user",
    });

    // Clean up old registrations under this test email to start fresh
    await Registration.deleteMany({
      $or: [
        { "runnerDetails.email": "zoho.e2e.test@example.com" },
        { "runnerDetails.email": "zoho.fail.test@example.com" }
      ]
    });
    await ZohoSyncLog.deleteMany({});

    // 2. Create a registration and verify MongoDB saving
    console.log("\n--- Task 2: Create a Brand-New Registration ---");
    const newReg = await Registration.create({
      marathon: marathon._id,
      user: user._id,
      registrationNumber: `REG-E2E-${Date.now()}`,
      status: "confirmed",
      raceCategory: {
        categoryId: marathon.raceCategories[0]._id,
        name: "10K",
        distance: "10K",
        price: 500,
      },
      runnerDetails: {
        fullName: "Zoho Test Runner",
        email: "zoho.e2e.test@example.com",
        phone: "9988776655",
        dateOfBirth: new Date("1995-05-15"),
        gender: "male",
      },
      emergencyContact: {
        fullName: "Emergency contact person",
        phone: "9876543210",
        relationship: "Friend",
      },
      address: {
        city: "Test City",
        state: "Test State",
        country: "India",
      },
      payment: {
        amount: 500,
        currency: "INR",
        method: "razorpay",
        transactionId: "TXN-E2E-12345",
        paidAt: new Date(),
        status: "completed",
      },
    });

    if (newReg && newReg._id) {
      console.log("✅ Registration saved to MongoDB:", newReg._id);
      results.registrationSaved = true;
    }

    // 3. Verify Zoho Sync (Automatic starts or Direct test)
    console.log("\n--- Task 3: Syncing to Zoho CRM ---");
    const syncResult = await syncParticipantDirect(newReg._id);
    console.log("Sync output:", syncResult);
    if (syncResult && syncResult.success) {
      console.log("✅ Zoho Sync Successful");
      results.zohoSyncSuccess = true;
    }

    // 4. Verify all mapped fields in Zoho Sync Log / Contact Details
    console.log("\n--- Task 4: Verify ZohoSyncLog Stores Required Fields & Mapped Fields ---");
    const syncLog = await ZohoSyncLog.findOne({ registration: newReg._id });
    if (syncLog) {
      console.log("Found Sync Log:", {
        registrationId: syncLog.registrationId,
        contactId: syncLog.contactId,
        status: syncLog.status,
        retryCount: syncLog.retryCount,
        syncedAt: syncLog.syncedAt,
        error: syncLog.error,
        requestFields: syncLog.request ? Object.keys(syncLog.request) : [],
        responseFields: syncLog.response ? Object.keys(syncLog.response) : [],
      });

      const reqPayload = syncLog.request;
      const expectedFields = [
        "First_Name", "Last_Name", "Email", "Phone", "Mailing_City",
        "Race_Name", "Race_Category", "Registration_Date", "Payment_Status"
      ];
      
      const allMapped = expectedFields.every(field => field in reqPayload);
      if (allMapped) {
        console.log("✅ All mapped fields verified successfully in Zoho payload.");
        results.mappedFieldsChecked = true;
      } else {
        console.warn("⚠️ Some mapped fields were missing in request:", reqPayload);
      }

      if (
        syncLog.registrationId &&
        syncLog.contactId &&
        syncLog.request &&
        syncLog.response &&
        syncLog.status &&
        syncLog.retryCount !== undefined &&
        syncLog.syncedAt
      ) {
        console.log("✅ ZohoSyncLog audit fields verification passed");
        results.syncLogStorage = true;
      } else {
        console.warn("⚠️ Some audit fields were missing in ZohoSyncLog:", syncLog);
      }
    } else {
      console.error("❌ No sync log found.");
    }

    // 5. Test Duplicate Registration (Updating Existing Contact)
    console.log("\n--- Task 5: Verify Duplicate Registrations Update Existing Zoho Contact ---");
    const duplicateReg = await Registration.create({
      marathon: marathon._id,
      user: user._id,
      registrationNumber: `REG-E2E-DUP-${Date.now()}`,
      status: "confirmed",
      raceCategory: {
        categoryId: marathon.raceCategories[1]._id,
        name: "5K Sprint",
        distance: "5K",
        price: 300,
      },
      runnerDetails: {
        fullName: "Zoho Test Runner Updated Name",
        email: "zoho.e2e.test@example.com",
        phone: "9988776655",
        dateOfBirth: new Date("1995-05-15"),
        gender: "male",
      },
      emergencyContact: {
        fullName: "Emergency contact person",
        phone: "9876543210",
        relationship: "Friend",
      },
      address: {
        city: "Updated City",
        state: "Test State",
        country: "India",
      },
      payment: {
        amount: 300,
        currency: "INR",
        method: "razorpay",
        transactionId: "TXN-E2E-DUP-12345",
        paidAt: new Date(),
        status: "completed",
      },
    });

    const dupSyncResult = await syncParticipantDirect(duplicateReg._id);
    console.log("Duplicate Sync result:", dupSyncResult);
    if (dupSyncResult && dupSyncResult.createdOrUpdated === "Updated") {
      console.log("✅ Duplicate registration updated existing contact successfully.");
      results.duplicateContactHandling = true;
    } else {
      console.error("❌ Duplicate sync did not resolve to 'Updated':", dupSyncResult);
    }

    // 6. Test Failure Handling & Retry Logic
    console.log("\n--- Task 6: Test Failure Handling & Retry Logic (Simulated API Failure) ---");
    process.env.ZOHO_SIMULATE_FAILURE = "true";

    const failureReg = await Registration.create({
      marathon: marathon._id,
      user: user._id,
      registrationNumber: `REG-E2E-FAIL-${Date.now()}`,
      status: "confirmed",
      raceCategory: {
        categoryId: marathon.raceCategories[2]._id,
        name: "Full Marathon",
        distance: "42K",
        price: 1000,
      },
      runnerDetails: {
        fullName: "Zoho Fail Runner",
        email: "zoho.fail.test@example.com",
        phone: "9988776655",
        dateOfBirth: new Date("1995-05-15"),
        gender: "male",
      },
      emergencyContact: {
        fullName: "Emergency contact person",
        phone: "9876543210",
        relationship: "Friend",
      },
      address: {
        city: "Test City",
        state: "Test State",
        country: "India",
      },
      payment: {
        amount: 500,
        currency: "INR",
        method: "razorpay",
        transactionId: "TXN-E2E-FAIL-12345",
        paidAt: new Date(),
        status: "completed",
      },
    });

    console.log("Triggering sync with simulated API failure...");
    try {
      await syncParticipantDirect(failureReg._id);
      console.error("❌ Sync did not throw error as expected during simulated failure.");
    } catch (err) {
      console.log("✅ Expected error caught during sync:", err.message);
    }

    // Check failed sync log
    const failedLog = await ZohoSyncLog.findOne({ registration: failureReg._id });
    if (failedLog) {
      console.log("Failed Log stored:", {
        status: failedLog.status,
        retryCount: failedLog.retryCount,
        error: failedLog.error,
        syncedAt: failedLog.syncedAt
      });

      if (failedLog.status === "Failed" && failedLog.error === "Simulated Zoho API Failure") {
        console.log("✅ Sync failure successfully logged.");
        results.failureHandling = true;
      }
      
      // Since it retries max 3 attempts total:
      // Attempt 1 fails -> Retries -> Attempt 2 fails -> Retries -> Attempt 3 fails -> final fail.
      // Therefore, retryCount (attempts - 1) should be 2.
      if (failedLog.retryCount === 2) {
        console.log("✅ Retry logic verified (3 attempts = 2 retries logged).");
        results.retryLogic = true;
      } else {
        console.warn("⚠️ Retry count was:", failedLog.retryCount);
      }
    } else {
      console.error("❌ Failed sync log was not created.");
    }

    // Clean up simulation environment variable
    delete process.env.ZOHO_SIMULATE_FAILURE;

  } catch (error) {
    console.error("Unexpected error in tests:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB.");
  }

  // Summary Report
  console.log("\n==================================");
  console.log("Verification Summary:");
  console.log("==================================");
  console.log(results.connection ? "✓ Zoho Connection: Passed" : "❌ Zoho Connection: Failed");
  console.log(results.registrationSaved ? "✓ Registration Saved to DB: Passed" : "❌ Registration Saved to DB: Failed");
  console.log(results.zohoSyncSuccess ? "✓ Zoho CRM Sync Success: Passed" : "❌ Zoho CRM Sync Success: Failed");
  console.log(results.mappedFieldsChecked ? "✓ Mapped Fields Verification: Passed" : "❌ Mapped Fields Verification: Failed");
  console.log(results.duplicateContactHandling ? "✓ Duplicate Contact Updated: Passed" : "❌ Duplicate Contact Updated: Failed");
  console.log(results.failureHandling ? "✓ Failure Logging: Passed" : "❌ Failure Logging: Failed");
  console.log(results.retryLogic ? "✓ Retry Logic verification: Passed" : "❌ Retry Logic verification: Failed");
  console.log(results.syncLogStorage ? "✓ ZohoSyncLog storage audit: Passed" : "❌ ZohoSyncLog storage audit: Failed");
  console.log("==================================\n");
}

runTests();
