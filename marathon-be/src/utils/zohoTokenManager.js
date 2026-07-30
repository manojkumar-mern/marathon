import axios from "axios";
import { zohoConfig } from "../config/zoho.config.js";

let accessToken = null;
let expiresAt = 0; // Epoch timestamp in milliseconds

/**
 * Retrieves a valid Zoho CRM access token, automatically refreshing it if expired or missing.
 * @returns {Promise<string>} The access token.
 */
export const getAccessToken = async () => {
  const now = Date.now();
  // If we have a cached token and it has more than 5 minutes of validity left, reuse it.
  if (accessToken && now < (expiresAt - 5 * 60 * 1000)) {
    return accessToken;
  }

  try {
    const params = new URLSearchParams();
    params.append("refresh_token", zohoConfig.refreshToken);
    params.append("client_id", zohoConfig.clientId);
    params.append("client_secret", zohoConfig.clientSecret);
    params.append("grant_type", "refresh_token");
    if (zohoConfig.redirectUri) {
      params.append("redirect_uri", zohoConfig.redirectUri);
    }

    const response = await axios.post(
      `${zohoConfig.accountsUrl.replace(/\/+$/, "")}/oauth/v2/token`,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data && response.data.access_token) {
      accessToken = response.data.access_token;
      // Default to 1 hour if expires_in is not provided
      const expiresInSec = response.data.expires_in || 3600;
      expiresAt = Date.now() + (expiresInSec * 1000);
      return accessToken;
    } else {
      throw new Error(
        `Token response did not contain access_token: ${JSON.stringify(response.data)}`
      );
    }
  } catch (error) {
    const errorMsg = error.response?.data
      ? typeof error.response.data === "string"
        ? error.response.data
        : JSON.stringify(error.response.data)
      : error.message;
    throw new Error(`Failed to refresh Zoho access token: ${errorMsg}`);
  }
};
