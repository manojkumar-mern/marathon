import Marathon from "./marathon.model.js";
import Registration from "../registration/registration.model.js";
import { AppError } from "../../utils/AppError.js";
import { escapeRegExp } from "../../utils/regex.js";

export const createMarathon = async (data) => {
  if (data.slug) {
    const existing = await Marathon.findOne({ slug: data.slug, isDeleted: { $ne: true } });
    if (existing) {
      throw new AppError("A marathon with this slug already exists", 409);
    }
  }

  if (data.eventCode) {
    const existing = await Marathon.findOne({ eventCode: data.eventCode, isDeleted: { $ne: true } });
    if (existing) {
      throw new AppError("A marathon with this event code already exists", 409);
    }
  }

  const marathon = await Marathon.create(data);
  return marathon;
};

export const getAllMarathons = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    city,
    status,
    featured,
    eventCode,
    sort = "-eventDate",
    all,
  } = query;

  const filter = { isDeleted: { $ne: true } };

  if (!all) filter.status = "published";

  if (search) {
    const escapedSearch = escapeRegExp(search);
    filter.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { shortDescription: { $regex: escapedSearch, $options: "i" } },
      { "venue.city": { $regex: escapedSearch, $options: "i" } },
      { eventCode: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if (city) filter["venue.city"] = { $regex: escapeRegExp(city), $options: "i" };
  if (status) filter.status = status;
  if (eventCode) filter.eventCode = { $regex: escapeRegExp(eventCode), $options: "i" };
  if (featured !== undefined) filter.featured = featured === "true";

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [marathons, total] = await Promise.all([
    Marathon.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
    Marathon.countDocuments(filter),
  ]);

  const marathonIds = marathons.map((m) => m._id);
  let countMap = {};
  if (marathonIds.length > 0) {
    const regCounts = await Registration.aggregate([
      { $match: { marathon: { $in: marathonIds } } },
      { $group: { _id: "$marathon", count: { $sum: 1 } } },
    ]);
    regCounts.forEach((r) => { countMap[r._id.toString()] = r.count; });
  }

  const marathonsWithCounts = marathons.map((m) => ({
    ...m,
    registrationCount: countMap[m._id.toString()] || 0,
  }));

  return {
    marathons: marathonsWithCounts,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
};

export const getMarathonBySlug = async (slug) => {
  const marathon = await Marathon.findOne({ slug, isDeleted: { $ne: true } });
  if (!marathon) {
    throw new AppError("Marathon not found", 404);
  }
  return marathon;
};

export const getMarathonById = async (id) => {
  const marathon = await Marathon.findById(id);
  if (!marathon || marathon.isDeleted) {
    throw new AppError("Marathon not found", 404);
  }
  return marathon;
};

export const updateMarathon = async (id, data) => {
  if (data.slug) {
    const existing = await Marathon.findOne({
      slug: data.slug,
      _id: { $ne: id },
      isDeleted: { $ne: true },
    });
    if (existing) {
      throw new AppError("A marathon with this slug already exists", 409);
    }
  }

  if (data.eventCode) {
    const existing = await Marathon.findOne({
      eventCode: data.eventCode,
      _id: { $ne: id },
      isDeleted: { $ne: true },
    });
    if (existing) {
      throw new AppError("A marathon with this event code already exists", 409);
    }
  }

  const marathon = await Marathon.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!marathon) {
    throw new AppError("Marathon not found", 404);
  }
  return marathon;
};

export const deleteMarathon = async (id) => {
  const marathon = await Marathon.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { returnDocument: "after" }
  );
  if (!marathon) {
    throw new AppError("Marathon not found", 404);
  }
  return marathon;
};

export const updateMarathonStatus = async (id, status) => {
  const marathon = await Marathon.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after", runValidators: true }
  );
  if (!marathon) {
    throw new AppError("Marathon not found", 404);
  }
  return marathon;
};
