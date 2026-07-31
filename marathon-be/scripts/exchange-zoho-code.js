import fs from "fs/promises";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI;
const ZOHO_ACCOUNTS_URL = process.env.ZOHO_ACCOUNTS_URL || "https://accounts.zoho.com";
const ZOHO_API_BASE_URL = process.env.ZOHO_API_BASE_URL || "https://www.zohoapis.com/crm/v2";

const main = async () => {
  const authCode = process.argv[2];
  if (!authCode) {
    console.error("\n❌ Error: Authorization code is missing!");
    console.log("Usage: node scripts/exchange-zoho-code.js <authorization_code>\n");
    process.exit(1);
  }

  // Validate required configuration variables
  const missing = [];
  if (!ZOHO_CLIENT_ID) missing.push("ZOHO_CLIENT_ID");
  if (!ZOHO_CLIENT_SECRET) missing.push("ZOHO_CLIENT_SECRET");
  if (!ZOHO_REDIRECT_URI) missing.push("ZOHO_REDIRECT_URI");

  if (missing.length > 0) {
    console.error(`\n❌ Error: Missing configuration values in .env: ${missing.join(", ")}`);
    process.exit(1);
  }

  console.log("Exchanging authorization code for refresh token...");

  try {
    const params = new URLSearchParams();
    params.append("code", authCode);
    params.append("client_id", ZOHO_CLIENT_ID);
    params.append("client_secret", ZOHO_CLIENT_SECRET);
    params.append("redirect_uri", ZOHO_REDIRECT_URI);
    params.append("grant_type", "authorization_code");

    const tokenUrl = `${ZOHO_ACCOUNTS_URL.replace(/\/+$/, "")}/oauth/v2/token`;

    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 15000,
    });

    if (response.data?.error) {
      throw new Error(`Zoho API returned error: ${response.data.error}`);
    }

    const { refresh_token, access_token } = response.data;

    if (!refresh_token) {
      throw new Error("No refresh_token returned from Zoho. Note: Zoho only returns a refresh token on the FIRST authorization. Please generate a new authorization code with prompt=consent or access_type=offline.");
    }

    console.log("✅ Successfully received OAuth tokens from Zoho.");

    // Update .env file
    const envPath = path.resolve(process.cwd(), ".env");
    let envContent = "";
    try {
      envContent = await fs.readFile(envPath, "utf-8");
    } catch (e) {
      console.warn("⚠️ Warning: .env file not found. Creating a new one.");
    }

    const refreshTokenPattern = /^ZOHO_REFRESH_TOKEN=.*/m;
    const newEntry = `ZOHO_REFRESH_TOKEN=${refresh_token}`;

    if (refreshTokenPattern.test(envContent)) {
      envContent = envContent.replace(refreshTokenPattern, newEntry);
    } else {
      // Append to the end
      envContent += `\n${newEntry}\n`;
    }

    await fs.writeFile(envPath, envContent, "utf-8");
    console.log("✅ Successfully updated ZOHO_REFRESH_TOKEN in .env configuration.");

    // Dynamic import to verify with the newly saved configuration
    console.log("Verifying Zoho CRM connection with updated configuration...");
    // Reload process.env with the new token
    process.env.ZOHO_REFRESH_TOKEN = refresh_token;

    const { verifyConnection } = await import("../src/services/zoho.service.js");
    const verification = await verifyConnection();

    if (verification.success) {
      console.log(`\n🎉 SUCCESS: ${verification.message}\n`);
    } else {
      console.error(`\n❌ Verification failed: ${verification.error}\n`);
    }

  } catch (error) {
    const errorMsg = error.response?.data
      ? typeof error.response.data === "string"
        ? error.response.data
        : JSON.stringify(error.response.data)
      : error.message;

    console.error("\n❌ Failed to complete OAuth authorization code exchange.");
    console.error("Details:", errorMsg);
    console.log("\nDeveloper Tip: Ensure the authorization code is fresh, matching the redirect URI, client ID/secret, and Accounts URL region.\n");
    process.exit(1);
  }
};

main();
