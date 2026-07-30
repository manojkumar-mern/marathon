import axios from "axios";
import { zohoConfig } from "../config/zoho.config.js";
import { getAccessToken as getAccessTokenFromManager } from "../utils/zohoTokenManager.js";
import Registration from "../modules/registration/registration.model.js";
import ZohoSyncLog from "../models/ZohoSyncLog.js";

// Centralized field mapping: local properties mapped to Zoho CRM custom module field API names.
export const FIELD_MAPPING = {
  fullName: "Full_Name",
  email: "Email",
  mobile: "Mobile",
  gender: "Gender",
  dob: "DOB",
  eventName: "Event_Name",
  raceCategory: "Race_Category",
  registrationId: "Registration_ID",
  paymentStatus: "Payment_Status",
  registrationDate: "Registration_Date",
  bibNumber: "Bib_Number",
  certificateStatus: "Certificate_Status",
  resultStatus: "Result_Status"
};

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
};

/**
 * Retrieves a valid Zoho CRM access token, automatically refreshing it if expired.
 * Centralized wrapper to meet requirements.
 * @returns {Promise<string>} The access token.
 */
export const getAccessToken = async () => {
  return await getAccessTokenFromManager();
};

/**
 * Maps a Registration document to the Zoho CRM record format.
 * Structured to easily support future fields (Bib Number, Results, etc.).
 * @param {Object} registration - The MongoDB registration document
 * @returns {Object} Zoho CRM mapped record
 */
export const mapRegistrationToZohoRecord = (registration) => {
  return {
    [FIELD_MAPPING.fullName]: registration.runnerDetails?.fullName || "",
    [FIELD_MAPPING.email]: registration.runnerDetails?.email || "",
    [FIELD_MAPPING.mobile]: registration.runnerDetails?.phone || "",
    [FIELD_MAPPING.gender]: registration.runnerDetails?.gender || "",
    [FIELD_MAPPING.dob]: formatDate(registration.runnerDetails?.dateOfBirth),
    [FIELD_MAPPING.eventName]: registration.marathon?.title || "Unknown Marathon",
    [FIELD_MAPPING.raceCategory]: registration.raceCategory?.name || "",
    [FIELD_MAPPING.registrationId]: registration.registrationNumber || registration._id.toString(),
    [FIELD_MAPPING.paymentStatus]: registration.payment?.status || registration.status,
    [FIELD_MAPPING.registrationDate]: formatDate(registration.createdAt),
    [FIELD_MAPPING.bibNumber]: registration.bibNumber || null,
    [FIELD_MAPPING.certificateStatus]: registration.certificateStatus || null,
    [FIELD_MAPPING.resultStatus]: registration.resultStatus || null,
  };
};

/**
 * Checks whether the participant already exists in Zoho CRM using registration ID, email, or mobile.
 * 
 * @param {Object} participantDetails - { registrationId, email, mobile }
 * @param {string} token - The Zoho access token
 * @returns {Promise<Object|null>} The matching Zoho record, or null if not found
 */
export const findParticipant = async (participantDetails, token) => {
  const { registrationId, email, mobile } = participantDetails;

  const searchId = registrationId ? registrationId.trim() : "";
  const searchEmail = email ? email.trim() : "";
  const searchMobile = mobile ? mobile.trim() : "";

  if (!searchId && !searchEmail && !searchMobile) {
    return null;
  }

  // Construct combined search criteria: e.g. ((A:equals:a)or((B:equals:b)or(C:equals:c)))
  const conditions = [];
  if (searchId) conditions.push(`(${FIELD_MAPPING.registrationId}:equals:${searchId})`);
  if (searchEmail) conditions.push(`(${FIELD_MAPPING.email}:equals:${searchEmail})`);
  if (searchMobile) conditions.push(`(${FIELD_MAPPING.mobile}:equals:${searchMobile})`);

  let criteria = "";
  if (conditions.length === 1) {
    criteria = conditions[0];
  } else if (conditions.length === 2) {
    criteria = `(${conditions[0]}or${conditions[1]})`;
  } else if (conditions.length === 3) {
    criteria = `(${conditions[0]}or(${conditions[1]}or${conditions[2]}))`;
  }

  const baseUrl = zohoConfig.apiBaseUrl.replace(/\/+$/, "");
  const url = `${baseUrl}/Marathon_Participants/search?criteria=${encodeURIComponent(criteria)}`;

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
      return null; // Zoho returns 204 when no records match
    }
    throw error;
  }
};

/**
 * Creates a new participant in Zoho CRM.
 * 
 * @param {Object} record - Mapped Zoho CRM record
 * @param {string} token - The Zoho access token
 * @returns {Promise<Object>} The API response details
 */
export const createParticipant = async (record, token) => {
  const baseUrl = zohoConfig.apiBaseUrl.replace(/\/+$/, "");
  const url = `${baseUrl}/Marathon_Participants`;

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
    return result;
  }
  throw new Error(`Failed to create Zoho CRM record: ${JSON.stringify(response.data)}`);
};

/**
 * Updates an existing participant in Zoho CRM by ID.
 * 
 * @param {string} zohoRecordId - Zoho record ID
 * @param {Object} record - Mapped Zoho CRM record updates
 * @param {string} token - The Zoho access token
 * @returns {Promise<Object>} The API response details
 */
export const updateParticipant = async (zohoRecordId, record, token) => {
  const baseUrl = zohoConfig.apiBaseUrl.replace(/\/+$/, "");
  const url = `${baseUrl}/Marathon_Participants/${zohoRecordId}`;

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
    return result;
  }
  throw new Error(`Failed to update Zoho CRM record: ${JSON.stringify(response.data)}`);
};

/**
 * Synchronizes a successfully paid participant registration to Zoho CRM's custom module.
 * Automatically performs duplicate detection, handles token refreshes, records status,
 * logs errors structurally, and fails gracefully to prevent UI/UX interruption.
 * 
 * @param {string} registrationId - The MongoDB registration ID
 * @returns {Promise<{success: boolean, status?: string, error?: string}>}
 */
export const syncParticipant = async (registrationId) => {
  let registration = null;
  let email = "unknown";
  let registrationIdString = registrationId;
  let syncLog = null;

  try {
    registration = await Registration.findById(registrationId).populate("marathon");
    if (!registration) {
      throw new Error(`Registration not found: ${registrationId}`);
    }

    email = registration.runnerDetails?.email || "unknown";
    registrationIdString = registration.registrationNumber || registration._id.toString();

    // Create or update local synchronization log, setting status to Pending initially
    syncLog = await ZohoSyncLog.findOneAndUpdate(
      { registration: registrationId },
      {
        $set: { email, registrationIdString },
        $inc: { attemptsCount: 1 },
        $setOnInsert: { status: "Pending" }
      },
      { new: true, upsert: true }
    );

    // Get oauth access token
    const token = await getAccessToken();

    // Prepare details for search
    const participantDetails = {
      registrationId: registrationIdString,
      email: registration.runnerDetails?.email,
      mobile: registration.runnerDetails?.phone
    };

    // Check if participant already exists in Zoho CRM
    const existingRecord = await findParticipant(participantDetails, token);
    const record = mapRegistrationToZohoRecord(registration);

    let syncStatus = "Success";
    if (existingRecord) {
      // Update existing record
      await updateParticipant(existingRecord.id, record, token);
      syncStatus = "Updated";
    } else {
      // Create new record
      await createParticipant(record, token);
      syncStatus = "Success";
    }

    // Mark sync log as successful/updated and clear errors
    await ZohoSyncLog.updateOne(
      { registration: registrationId },
      {
        $set: {
          status: syncStatus,
          lastSyncAttempt: new Date(),
          errorDetails: null
        }
      }
    );

    console.log(`[Zoho CRM Sync] Successfully synced registration ${registrationIdString}. Status: ${syncStatus}`);
    return { success: true, status: syncStatus };

  } catch (error) {
    const timestamp = new Date();
    const endpoint = error.config?.url || "Unknown Endpoint";
    const httpStatus = error.response?.status || 500;
    const errorMessage = error.response?.data
      ? typeof error.response.data === "string"
        ? error.response.data
        : JSON.stringify(error.response.data)
      : error.message;

    // Structured logging as requested
    const structuredErrorLog = {
      timestamp,
      endpoint,
      httpStatus,
      errorMessage,
      registrationId: registrationIdString,
      participantEmail: email
    };

    console.error("[Zoho CRM Sync Error]", JSON.stringify(structuredErrorLog, null, 2));

    // Save error state and set status to Failed in MongoDB ZohoSyncLog
    if (syncLog || registration) {
      try {
        await ZohoSyncLog.updateOne(
          { registration: registrationId },
          {
            $set: {
              status: "Failed",
              lastSyncAttempt: timestamp,
              errorDetails: {
                timestamp,
                endpoint,
                httpStatus,
                errorMessage
              }
            }
          }
        );
      } catch (dbError) {
        console.error("[Zoho CRM DB Error] Failed to write failure sync log:", dbError.message);
      }
    }

    // Fail gracefully: Never expose Zoho errors to the user or interrupt the registration flow
    return { success: false, status: "Failed", error: errorMessage };
  }
};

// Backwards compatibility alias
export const syncRegistration = syncParticipant;
