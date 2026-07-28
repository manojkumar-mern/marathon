import Settings from "./settings.model.js";

// Always upsert — return the singleton document
export const getSettings = async () => {
  const settings = await Settings.findOneAndUpdate(
    { key: "global" },
    { $setOnInsert: { key: "global" } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();
  return settings;
};

export const updateSettings = async (data) => {
  // Build a flat update object to support partial section updates
  const update = {};
  const allowed = ["general", "registration", "payments", "email", "social"];

  for (const section of allowed) {
    if (data[section] && typeof data[section] === "object") {
      for (const [k, v] of Object.entries(data[section])) {
        // Never store secrets in DB in plaintext in production; for now store as-is
        update[`${section}.${k}`] = v;
      }
    }
  }

  const settings = await Settings.findOneAndUpdate(
    { key: "global" },
    { $set: update },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return settings;
};
