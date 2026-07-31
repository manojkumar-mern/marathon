import axios from "axios";
import { zohoConfig } from "../config/zoho.config.js";
import { getAccessToken as getAccessTokenFromManager } from "../utils/zohoTokenManager.js";
import Registration from "../modules/registration/registration.model.js";
import ZohoSyncLog from "../models/ZohoSyncLog.js";
import { mapRegistrationToZohoContact } from "./zohoMapper.js";

/**
 * Retrieves a valid Zoho CRM access token, automatically refreshing it if expired.
 * @returns {Promise<string>} The access token.
 */
export const getAccessToken = async () => {
  return await getAccessTokenFromManager();
};

/**
 * Executes a function with retries and exponential backoff.
 * Maximum 3 attempts total.
 * 
 * @param {Function} fn - Async function to execute
 * @param {string} operationName - Name of operation for logging
 * @param {Object} tracker - Tracker object to record retry count
 * @returns {Promise<any>}
 */
const executeWithRetry = async (fn, operationName = "Operation", tracker = { retryCount: 0 }) => {
  const maxAttempts = 3;
  const initialDelay = 1000; // 1 second base delay

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Check for simulated failure
    if (process.env.ZOHO_SIMULATE_FAILURE === "true") {
      tracker.retryCount = attempt - 1;
      const simError = new Error("Simulated Zoho API Failure");
      console.error(`[Zoho CRM] [SIMULATOR] ${operationName} failed (Attempt ${attempt}/${maxAttempts}): Simulated Zoho API Failure`);
      if (attempt >= maxAttempts) {
        throw simError;
      }
      const delay = initialDelay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    try {
      return await fn();
    } catch (error) {
      tracker.retryCount = attempt - 1;
      const errorMsg = error.response?.data
        ? typeof error.response.data === "string"
          ? error.response.data
          : JSON.stringify(error.response.data)
        : error.message;

      console.error(`[Zoho CRM] ${operationName} failed (Attempt ${attempt}/${maxAttempts}): ${errorMsg}`);

      if (attempt >= maxAttempts) {
        console.error(`[Zoho CRM] Sync Failed for ${operationName} after ${maxAttempts} attempts.`);
        throw error;
      }

      const delay = initialDelay * Math.pow(2, attempt - 1);
      console.log(`[Zoho CRM] Retry ${attempt} for ${operationName} in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Checks whether the participant already exists in Zoho CRM Contacts using Email.
 * 
 * @param {string} email - The participant email
 * @param {string} token - The Zoho access token
 * @param {Object} tracker - Tracker object to record retry count
 * @returns {Promise<Object|null>} The matching Zoho Contact record, or null if not found
 */
export const findParticipant = async (email, token, tracker) => {
  if (!email) return null;

  const baseUrl = zohoConfig.apiBaseUrl.replace(/\/+$/, "");
  const url = `${baseUrl}/Contacts/search?email=${encodeURIComponent(email.trim())}`;

  return await executeWithRetry(async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
        timeout: 10000,
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null;
    } catch (error) {
      if (error.response?.status === 204) {
        return null; // 204 means no matching contacts found
      }
      throw error;
    }
  }, "Search Contact by Email", tracker);
};

/**
 * Creates a new Contact in Zoho CRM.
 * 
 * @param {Object} record - Mapped Zoho CRM Contact record
 * @param {string} token - The Zoho access token
 * @param {Object} tracker - Tracker object to record retry count
 * @returns {Promise<Object>} The API response details
 */
export const createParticipant = async (record, token, tracker) => {
  const baseUrl = zohoConfig.apiBaseUrl.replace(/\/+$/, "");
  const url = `${baseUrl}/Contacts`;

  console.log("[Zoho CRM] Creating Contact...");

  return await executeWithRetry(async () => {
    const response = await axios.post(
      url,
      { data: [record] },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const result = response.data?.data?.[0];
    if (result && (result.status === "success" || result.code === "SUCCESS")) {
      console.log("[Zoho CRM] Contact Created successfully");
      return response.data;
    }
    throw new Error(`Failed to create Zoho Contact: ${JSON.stringify(response.data)}`);
  }, "Create Contact", tracker);
};

/**
 * Updates an existing Contact in Zoho CRM by ID.
 * 
 * @param {string} zohoContactId - Zoho Contact ID
 * @param {Object} record - Mapped Zoho CRM Contact record updates
 * @param {string} token - The Zoho access token
 * @param {Object} tracker - Tracker object to record retry count
 * @returns {Promise<Object>} The API response details
 */
export const updateParticipant = async (zohoContactId, record, token, tracker) => {
  const baseUrl = zohoConfig.apiBaseUrl.replace(/\/+$/, "");
  const url = `${baseUrl}/Contacts/${zohoContactId}`;

  console.log("[Zoho CRM] Updating Contact...");

  return await executeWithRetry(async () => {
    const response = await axios.put(
      url,
      { data: [record] },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const result = response.data?.data?.[0];
    if (result && (result.status === "success" || result.code === "SUCCESS")) {
      console.log("[Zoho CRM] Contact Updated successfully");
      return response.data;
    }
    throw new Error(`Failed to update Zoho Contact: ${JSON.stringify(response.data)}`);
  }, "Update Contact", tracker);
};

/**
 * Performs actual Zoho CRM sync operations. Assumed to be run asynchronously.
 */
const runSyncProcess = async (registrationId) => {
  const tracker = { retryCount: 0 };
  let record = null;
  let responseData = null;
  try {
    const registration = await Registration.findById(registrationId)
      .populate("marathon")
      .populate("user");
    
    if (!registration) {
      throw new Error(`Registration not found: ${registrationId}`);
    }

    const email = registration.runnerDetails?.email;
    if (!email) {
      throw new Error(`Registration runner email is missing: ${registrationId}`);
    }

    record = mapRegistrationToZohoContact(registration);

    // Set sync status to Pending initially in DB
    await ZohoSyncLog.findOneAndUpdate(
      { registration: registrationId },
      {
        $set: {
          registrationId,
          status: "Pending",
          timestamp: new Date(),
          error: null,
          request: record,
          retryCount: 0
        }
      },
      { upsert: true }
    );

    // Fetch Token
    const token = await getAccessToken();

    // Check if Contact exists by Email
    const existingContact = await findParticipant(email, token, tracker);

    let syncStatus = "Success";
    let zohoContactId = null;

    if (existingContact) {
      zohoContactId = existingContact.id;
      responseData = await updateParticipant(zohoContactId, record, token, tracker);
      syncStatus = "Updated";
    } else {
      const result = await createParticipant(record, token, tracker);
      zohoContactId = result?.data?.[0]?.details?.id;
      responseData = result;
      syncStatus = "Success";
    }

    // Update log to Success/Updated in database
    await ZohoSyncLog.updateOne(
      { registration: registrationId },
      {
        $set: {
          registrationId,
          zohoContactId,
          contactId: zohoContactId,
          status: syncStatus,
          timestamp: new Date(),
          syncedAt: new Date(),
          error: null,
          response: responseData,
          retryCount: tracker.retryCount
        }
      }
    );

    const registrationIdString = registration.registrationNumber || registration._id.toString();
    console.log(`✓ Synced Registration to Zoho CRM\nRegistration ID: ${registrationIdString}\nZoho Contact ID: ${zohoContactId}`);

    return {
      success: true,
      registrationId: registrationIdString,
      zohoContactId,
      createdOrUpdated: syncStatus === "Success" ? "Created" : "Updated"
    };
  } catch (error) {
    const errorMsg = error.response?.data
      ? typeof error.response.data === "string"
        ? error.response.data
        : JSON.stringify(error.response.data)
      : error.message;

    console.error(`❌ Zoho Sync Failed\n${errorMsg}`);

    try {
      await ZohoSyncLog.updateOne(
        { registration: registrationId },
        {
          $set: {
            registrationId,
            status: "Failed",
            timestamp: new Date(),
            syncedAt: new Date(),
            error: errorMsg,
            request: record,
            response: error.response?.data || { message: error.message },
            retryCount: tracker.retryCount
          }
        }
      );
    } catch (dbError) {
      console.error("[Zoho CRM Sync Log DB Error] Failed to update fail state:", dbError.message);
    }

    throw new Error(errorMsg);
  }
};

/**
 * Synchronizes a successfully paid participant registration to Zoho CRM's Contacts module.
 * Runs asynchronously and fails gracefully to prevent registration/payment flows from blocking.
 * 
 * @param {string} registrationId - The MongoDB registration ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const syncParticipant = async (registrationId) => {
  // Run the sync process in the background to ensure it never blocks registration
  runSyncProcess(registrationId).catch((err) => {
    console.error("[Zoho CRM Background Sync Error]", err);
  });

  return { success: true, message: "Synchronization started asynchronously" };
};

/**
 * Verifies the connection to Zoho CRM by making simple authenticated API requests.
 * @returns {Promise<{connected: boolean, organization?: string, contactsFound?: number, reason?: string}>}
 */
export const verifyConnection = async () => {
  try {
    const token = await getAccessToken();
    const baseUrl = zohoConfig.apiBaseUrl.replace(/\/+$/, "");

    // Fetch one Contact to verify read permission (requires only ZohoCRM.modules.ALL or ZohoCRM.modules.READ)
    const contactsResponse = await axios.get(`${baseUrl}/Contacts?per_page=1`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      timeout: 10000,
    });

    let contactsFound = 0;
    if (contactsResponse.data && Array.isArray(contactsResponse.data.data)) {
      contactsFound = contactsResponse.data.data.length;
    }

    return {
      connected: true,
      organization: "Zoho CRM",
      contactsFound
    };
  } catch (error) {
    const errorMsg = error.response?.data
      ? typeof error.response.data === "string"
        ? error.response.data
        : JSON.stringify(error.response.data)
      : error.message;

    return {
      connected: false,
      reason: errorMsg
    };
  }
};

/**
 * Direct synchronous version of participant sync (useful for CLI/Admin tools).
 */
export const syncParticipantDirect = runSyncProcess;

// Backwards compatibility alias
export const syncRegistration = syncParticipant;
