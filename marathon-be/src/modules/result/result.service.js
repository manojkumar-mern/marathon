import Result from "./result.model.js";
import Registration from "../registration/registration.model.js";
import { AppError } from "../../utils/AppError.js";
import { notificationService } from "../../services/notification/notification.service.js";
import { NOTIFICATION_TYPES } from "../../services/notification/notification.types.js";
import { escapeRegExp } from "../../utils/regex.js";

function formatTime(seconds) {
  if (seconds == null) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

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
    const escapedSearch = escapeRegExp(search);
    filter.$or = [
      { registrationNumber: { $regex: escapedSearch, $options: "i" } },
      { "runnerDetails.fullName": { $regex: escapedSearch, $options: "i" } },
      { bibNumber: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [results, total] = await Promise.all([
    Result.find(filter)
      .populate("marathon", "title slug eventDate")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Result.countDocuments(filter),
  ]);

  return {
    results,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
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

  // Check duplicate result entries
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
          finishStatus: row.finishStatus || "Completed",
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
        finishStatus: row.finishStatus || "Completed",
      });
      created.push(result._id);
    } catch (err) {
      errors.push({ row, reason: err.message });
    }
  }

  return { created: created.length, errors };
};

// --- RANKINGS CALCULATION SERVICE ---

export const calculateRankings = async (marathonId) => {
  const results = await Result.find({
    marathon: marathonId,
    $or: [{ status: "finished" }, { finishStatus: "Completed" }],
  }).populate("registration");

  if (results.length === 0) return;

  // 1. Calculate Overall Position & Rank
  results.sort((a, b) => {
    const timeA = a.finishTime ?? a.chipTime ?? Infinity;
    const timeB = b.finishTime ?? b.chipTime ?? Infinity;
    return timeA - timeB;
  });

  for (let i = 0; i < results.length; i++) {
    results[i].overallRank = i + 1;
    results[i].overallPosition = i + 1;
  }

  // 2. Calculate Category Position & Rank
  const categoryGroups = {};
  for (const res of results) {
    const catName = res.raceCategory?.name || "default";
    if (!categoryGroups[catName]) categoryGroups[catName] = [];
    categoryGroups[catName].push(res);
  }

  for (const catName of Object.keys(categoryGroups)) {
    categoryGroups[catName].sort((a, b) => {
      const timeA = a.finishTime ?? a.chipTime ?? Infinity;
      const timeB = b.finishTime ?? b.chipTime ?? Infinity;
      return timeA - timeB;
    });
    for (let i = 0; i < categoryGroups[catName].length; i++) {
      categoryGroups[catName][i].categoryRank = i + 1;
      categoryGroups[catName][i].categoryPosition = i + 1;
    }
  }

  // 3. Calculate Gender Position & Rank
  const genderGroups = {};
  for (const res of results) {
    const gender = res.registration?.runnerDetails?.gender || "unknown";
    if (!genderGroups[gender]) genderGroups[gender] = [];
    genderGroups[gender].push(res);
  }

  for (const gender of Object.keys(genderGroups)) {
    genderGroups[gender].sort((a, b) => {
      const timeA = a.finishTime ?? a.chipTime ?? Infinity;
      const timeB = b.finishTime ?? b.chipTime ?? Infinity;
      return timeA - timeB;
    });
    for (let i = 0; i < genderGroups[gender].length; i++) {
      genderGroups[gender][i].genderRank = i + 1;
      genderGroups[gender][i].genderPosition = i + 1;
    }
  }

  // Save all updated documents
  await Promise.all(results.map((res) => res.save()));
};

// --- PUBLISH / UNPUBLISH SERVICES ---

export const publishResults = async (marathonId) => {
  // Check if any results exist for this marathon
  const count = await Result.countDocuments({ marathon: marathonId });
  if (count === 0) throw new AppError("No results found for this marathon to publish", 404);

  // Validation: Prevent publishing incomplete/pending results
  const incomplete = await Result.findOne({
    marathon: marathonId,
    $or: [
      { status: "pending" },
      { finishStatus: "Pending" },
      {
        $or: [{ status: "finished" }, { finishStatus: "Completed" }],
        finishTime: { $exists: false },
        chipTime: { $exists: false },
      },
    ],
  });
  if (incomplete) {
    throw new AppError("Cannot publish results: some runner results are incomplete or pending", 400);
  }

  // Calculate official rankings
  await calculateRankings(marathonId);

  // Mark all as published
  await Result.updateMany({ marathon: marathonId }, { isPublished: true });

  // Trigger Notification Engine for all participants
  const publishedResults = await Result.find({ marathon: marathonId }).populate("marathon");
  for (const res of publishedResults) {
    if (res.runnerDetails?.email && (res.finishStatus === "Completed" || res.status === "finished")) {
      try {
        await notificationService.send({
          recipient: { email: res.runnerDetails.email },
          type: NOTIFICATION_TYPES.RESULT_PUBLISHED,
          data: {
            participantName: res.runnerDetails.fullName,
            marathonName: res.marathon?.title || "Marathon Event",
            finishTime: formatTime(res.finishTime || res.chipTime),
            rank: res.overallRank || res.overallPosition || "—",
          },
        });
      } catch (err) {
        console.error(`Failed to send result publication notification to ${res.runnerDetails.email}:`, err.message);
      }
    }
  }

  return { published: count };
};

export const unpublishResults = async (marathonId) => {
  const count = await Result.countDocuments({ marathon: marathonId });
  if (count === 0) throw new AppError("No results found for this marathon", 404);

  await Result.updateMany({ marathon: marathonId }, { isPublished: false });
  return { unpublished: count };
};

// --- QUERY SERVICES ---

export const getLeaderboard = async (marathonId, query = {}) => {
  const { category, gender, page = 1, limit = 50 } = query;

  const filter = { marathon: marathonId, isPublished: true, $or: [{ status: "finished" }, { finishStatus: "Completed" }] };

  if (category) {
    filter["raceCategory.name"] = category;
  }

  if (gender) {
    const registrations = await Registration.find({
      marathon: marathonId,
      "runnerDetails.gender": gender,
    }).select("_id").lean();
    const regIds = registrations.map((r) => r._id);
    filter.registration = { $in: regIds };
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
  const skip = (pageNum - 1) * limitNum;

  // If filtered by category, sort by categoryRank, otherwise sort by overallRank
  const sortField = category ? "categoryRank" : "overallRank";

  const [leaderboard, total] = await Promise.all([
    Result.find(filter)
      .populate("registration", "runnerDetails")
      .sort(sortField)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Result.countDocuments(filter),
  ]);

  return {
    leaderboard,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
};

export const getParticipantResult = async (registrationId) => {
  const result = await Result.findOne({ registration: registrationId })
    .populate("marathon", "title slug eventDate venue")
    .lean();

  if (!result) throw new AppError("Result not found for this registration", 404);
  return result;
};
