const defaults = {
  appName: "EventManagementApp",
  companyName: "Company Name",
  supportEmail: "support@example.com",
  website: "https://example.com",
  logo: "",
  primaryColor: "#2563eb",
  secondaryColor: "#1e40af",
  copyright: "\u00a9 All rights reserved.",
  socialLinks: {
    facebook: "",
    twitter: "",
    instagram: "",
  },
  emailFooter:
    "This is an automated message from the application. Please do not reply to this email.",
};

export const branding = {
  appName: process.env.APP_NAME || defaults.appName,
  companyName: process.env.COMPANY_NAME || defaults.companyName,
  supportEmail: process.env.SUPPORT_EMAIL || defaults.supportEmail,
  website: process.env.WEBSITE_URL || defaults.website,
  logo: process.env.LOGO_URL || defaults.logo,
  primaryColor: process.env.PRIMARY_COLOR || defaults.primaryColor,
  secondaryColor: process.env.SECONDARY_COLOR || defaults.secondaryColor,
  copyright: process.env.COPYRIGHT_TEXT || defaults.copyright,
  socialLinks: {
    facebook: process.env.FACEBOOK_URL || defaults.socialLinks.facebook,
    twitter: process.env.TWITTER_URL || defaults.socialLinks.twitter,
    instagram: process.env.INSTAGRAM_URL || defaults.socialLinks.instagram,
  },
  emailFooter:
    process.env.EMAIL_FOOTER_TEXT || defaults.emailFooter,

  registrationPrefix: process.env.REGISTRATION_PREFIX || "REG",

  locale: process.env.LOCALE || "en-IN",
};
