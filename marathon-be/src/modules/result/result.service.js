import Result from "./result.model.js";
import Registration from "../registration/registration.model.js";
import { AppError } from "../../utils/AppError.js";

export const getAllResults = async (query = {}) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    status,
    event,
    sort = "-createdAt",
  } = query;

  const filter = {};
  if (status) filter.status = status;
  if (event) filter.marathon = event;
  if (search) {
    filter.$or = [
      { registrationNumber: { $regex: search, $options: "i" } },
      { "runnerDetails.fullName": { $regex: search, $options: "i" } },
      { bibNumber: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [results, total] = await Promise.all([
    Result.find(filter)
      .populate("marathon", "title slug eventDate")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Result.countDocuments(filter),
  ]);

  return {
    results,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
};

export const getResultById = async (id) => {
  const result = await Result.findById(id)
    .populate("marathon", "title slug eventDate venue")
    .populate("registration", "registrationNumber status tshirtSize")
    .lean();

  if (!result) throw new AppError("Result not found", 404);
  return result;
};

export const createResult = async (data) => {
  const { registrationId, ...rest } = data;

  const registration = await Registration.findById(registrationId)
    .populate("marathon", "title")
    .lean();

  if (!registration) throw new AppError("Registration not found", 404);

  // Check duplicate
  const exists = await Result.findOne({ registration: registrationId });
  if (exists) throw new AppError("A result already exists for this registration", 409);

  const result = await Result.create({
    registration: registrationId,
    marathon: registration.marathon._id,
    registrationNumber: registration.registrationNumber,
    bibNumber: registration.bibNumber,
    runnerDetails: {
      fullName: registration.runnerDetails?.fullName,
      email: registration.runnerDetails?.email,
    },
    raceCategory: {
      name: registration.raceCategory?.name,
      distance: registration.raceCategory?.distance,
    },
    ...rest,
  });

  return result;
};

export const updateResult = async (id, data) => {
  const result = await Result.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!result) throw new AppError("Result not found", 404);
  return result;
};

export const deleteResult = async (id) => {
  const result = await Result.findByIdAndDelete(id);
  if (!result) throw new AppError("Result not found", 404);
};

// Bulk import from CSV/JSON array
export const bulkImportResults = async (rows) => {
  const created = [];
  const errors = [];

  for (const row of rows) {
    try {
      const reg = await Registration.findOne({
        registrationNumber: row.registrationNumber,
      }).lean();

      if (!reg) {
        errors.push({ row, reason: "Registration not found" });
        continue;
      }

      const existing = await Result.findOne({ registration: reg._id });
      if (existing) {
        // Update instead of create
        await Result.findByIdAndUpdate(existing._id, {
          gunTime: row.gunTime,
          chipTime: row.chipTime,
          overallPosition: row.overallPosition,
          categoryPosition: row.categoryPosition,
          genderPosition: row.genderPosition,
          status: row.status || "finished",
          bibNumber: row.bibNumber || reg.bibNumber,
        });
        created.push(existing._id);
        continue;
      }

      const result = await Result.create({
        registration: reg._id,
        marathon: reg.marathon,
        registrationNumber: reg.registrationNumber,
        bibNumber: row.bibNumber || reg.bibNumber,
        runnerDetails: {
          fullName: reg.runnerDetails?.fullName,
          email: reg.runnerDetails?.email,
        },
        raceCategory: {
          name: reg.raceCategory?.name,
          distance: reg.raceCategory?.distance,
        },
        gunTime: row.gunTime,
        chipTime: row.chipTime,
        overallPosition: row.overallPosition,
        categoryPosition: row.categoryPosition,
        genderPosition: row.genderPosition,
        status: row.status || "finished",
      });
      created.push(result._id);
    } catch (err) {
      errors.push({ row, reason: err.message });
    }
  }

  return { created: created.length, errors };
};
