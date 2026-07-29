export const NOTIFICATION_TYPES = {
  REGISTRATION_SUCCESS: "REGISTRATION_SUCCESS",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  EVENT_REMINDER: "EVENT_REMINDER",
  RACE_DAY_REMINDER: "RACE_DAY_REMINDER",
  CERTIFICATE_READY: "CERTIFICATE_READY",
  RESULT_PUBLISHED: "RESULT_PUBLISHED",
  MARKETING_CAMPAIGN: "MARKETING_CAMPAIGN",
};

export const CHANNELS = {
  EMAIL: "email",
  WHATSAPP: "whatsapp",
  SMS: "sms",
  PUSH: "push",
};

// Map notification types to their default enabled channels and formatters
export const NOTIFICATION_CONFIGS = {
  [NOTIFICATION_TYPES.REGISTRATION_SUCCESS]: {
    defaultChannels: [CHANNELS.EMAIL, CHANNELS.WHATSAPP],
    formatters: {
      [CHANNELS.EMAIL]: (data) => ({
        subject: `STRIDEFORGE - Registration Confirmed: ${data.marathonName}`,
        templateName: "registration_success",
        context: data,
      }),
      [CHANNELS.WHATSAPP]: (data) => ({
        templateName: "registration_confirmation",
        components: [
          { type: "body", parameters: [
            { type: "text", text: data.participantName },
            { type: "text", text: data.marathonName },
            { type: "text", text: data.eventDate },
            { type: "text", text: data.registrationId },
            { type: "text", text: data.bibNumber || "To be allocated" }
          ]}
        ],
      }),
    },
  },
  [NOTIFICATION_TYPES.PAYMENT_SUCCESS]: {
    defaultChannels: [CHANNELS.EMAIL],
    formatters: {
      [CHANNELS.EMAIL]: (data) => ({
        subject: `STRIDEFORGE - Payment Receipt: ${data.marathonName}`,
        templateName: "payment_success",
        context: data,
      }),
    },
  },
  [NOTIFICATION_TYPES.EVENT_REMINDER]: {
    defaultChannels: [CHANNELS.EMAIL, CHANNELS.WHATSAPP],
    formatters: {
      [CHANNELS.EMAIL]: (data) => ({
        subject: `Reminder: Upcoming Race - ${data.marathonName}`,
        templateName: "event_reminder",
        context: data,
      }),
      [CHANNELS.WHATSAPP]: (data) => ({
        templateName: "event_reminder",
        components: [
          { type: "body", parameters: [
            { type: "text", text: data.participantName },
            { type: "text", text: data.marathonName },
            { type: "text", text: data.eventDate },
            { type: "text", text: data.venue }
          ]}
        ],
      }),
    },
  },
  [NOTIFICATION_TYPES.RACE_DAY_REMINDER]: {
    defaultChannels: [CHANNELS.WHATSAPP, CHANNELS.SMS],
    formatters: {
      [CHANNELS.WHATSAPP]: (data) => ({
        templateName: "race_day_reminder",
        components: [
          { type: "body", parameters: [
            { type: "text", text: data.participantName },
            { type: "text", text: data.marathonName },
            { type: "text", text: data.reportingTime },
            { type: "text", text: data.bibNumber || "Expo Pick-up" }
          ]}
        ],
      }),
      [CHANNELS.SMS]: (data) => `Hi ${data.participantName}, Race Day for ${data.marathonName} is tomorrow! Report at ${data.reportingTime}. Bib: ${data.bibNumber || "Expo Pick-up"}.`,
    },
  },
  [NOTIFICATION_TYPES.CERTIFICATE_READY]: {
    defaultChannels: [CHANNELS.EMAIL, CHANNELS.WHATSAPP],
    formatters: {
      [CHANNELS.EMAIL]: (data) => ({
        subject: `STRIDEFORGE - Certificate Ready: ${data.marathonName}`,
        templateName: "certificate_ready",
        context: data,
      }),
      [CHANNELS.WHATSAPP]: (data) => ({
        templateName: "certificate_ready",
        components: [
          { type: "body", parameters: [
            { type: "text", text: data.participantName },
            { type: "text", text: data.marathonName },
            { type: "text", text: data.certificateUrl || data.verifyUrl }
          ]}
        ],
      }),
    },
  },
  [NOTIFICATION_TYPES.RESULT_PUBLISHED]: {
    defaultChannels: [CHANNELS.EMAIL, CHANNELS.WHATSAPP],
    formatters: {
      [CHANNELS.EMAIL]: (data) => ({
        subject: `STRIDEFORGE - Race Results Published: ${data.marathonName}`,
        templateName: "result_published",
        context: data,
      }),
      [CHANNELS.WHATSAPP]: (data) => ({
        templateName: "result_published",
        components: [
          { type: "body", parameters: [
            { type: "text", text: data.participantName },
            { type: "text", text: data.marathonName },
            { type: "text", text: data.finishTime },
            { type: "text", text: data.rank || "N/A" }
          ]}
        ],
      }),
    },
  },
  [NOTIFICATION_TYPES.MARKETING_CAMPAIGN]: {
    defaultChannels: [CHANNELS.EMAIL],
    formatters: {
      [CHANNELS.EMAIL]: (data) => ({
        subject: data.subject || "Exciting News from STRIDEFORGE!",
        templateName: "marketing",
        context: data,
      }),
    },
  },
};
