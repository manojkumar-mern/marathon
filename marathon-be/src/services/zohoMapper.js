export const FIELD_MAPPING = {
  firstName: "First_Name",
  lastName: "Last_Name",
  email: "Email",
  phone: "Phone",
  gender: "Gender",
  dob: "Date_of_Birth",
  city: "Mailing_City",
  state: "Mailing_State",
  country: "Mailing_Country",
  emergencyName: "Emergency_Contact_Name",
  emergencyPhone: "Emergency_Contact_Phone",
  raceName: "Race_Name",
  raceCategory: "Race_Category",
  registrationDate: "Registration_Date",
  paymentStatus: "Payment_Status",
  registrationStatus: "Registration_Status",
  bibNumber: "Bib_Number"
};

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
};

/**
 * Maps a MongoDB Registration document to the Zoho CRM Contact format.
 * Never passes MongoDB documents directly; converts them completely.
 * 
 * @param {Object} registration - The populated MongoDB registration document
 * @returns {Object} The Zoho CRM Contact record
 */
export const mapRegistrationToZohoContact = (registration) => {
  const fullName = registration.runnerDetails?.fullName || "";
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || "Runner";
  const lastName = nameParts.slice(1).join(" ") || "Participant"; // Last name is required in Zoho Contacts

  return {
    [FIELD_MAPPING.firstName]: firstName,
    [FIELD_MAPPING.lastName]: lastName,
    [FIELD_MAPPING.email]: registration.runnerDetails?.email || "",
    [FIELD_MAPPING.phone]: registration.runnerDetails?.phone || "",
    [FIELD_MAPPING.gender]: registration.runnerDetails?.gender || "",
    [FIELD_MAPPING.dob]: formatDate(registration.runnerDetails?.dateOfBirth),
    [FIELD_MAPPING.city]: registration.address?.city || "",
    [FIELD_MAPPING.state]: registration.address?.state || "",
    [FIELD_MAPPING.country]: registration.address?.country || "India",
    [FIELD_MAPPING.emergencyName]: registration.emergencyContact?.fullName || "",
    [FIELD_MAPPING.emergencyPhone]: registration.emergencyContact?.phone || "",
    [FIELD_MAPPING.raceName]: registration.marathon?.title || "Unknown Marathon",
    [FIELD_MAPPING.raceCategory]: registration.raceCategory?.name || "",
    [FIELD_MAPPING.registrationDate]: formatDate(registration.createdAt),
    [FIELD_MAPPING.paymentStatus]: registration.payment?.status || registration.status,
    [FIELD_MAPPING.registrationStatus]: registration.status,
    [FIELD_MAPPING.bibNumber]: registration.bibNumber || null
  };
};
