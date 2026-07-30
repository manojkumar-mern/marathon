export const zohoConfig = {
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  refreshToken: process.env.ZOHO_REFRESH_TOKEN,
  redirectUri: process.env.ZOHO_REDIRECT_URI,
  accountsUrl: process.env.ZOHO_ACCOUNTS_URL || "https://accounts.zoho.com",
  apiBaseUrl: process.env.ZOHO_API_BASE_URL || "https://www.zohoapis.com/crm/v2",
};
