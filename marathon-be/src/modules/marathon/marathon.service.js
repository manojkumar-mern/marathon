import Marathon from "./marathon.model.js";
import { AppError } from "../../utils/AppError.js";

export const createMarathon = async (data) => {
  const existing = await Marathon.findOne({ slug: data.slug });
  if (existing) {
    const baseSlug = data.slug.replace(/-\d+$/, "");
    const count = await Marathon.countDocuments({ slug: new RegExp(`^${baseSlug}-?\\d*$`) });
    data.slug = `${baseSlug}-${count + 1}`;
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
    sort = "-eventDate",
    all,
  } = query;

  const filter = {};

  if (!all) filter.status = "published";

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { shortDescription: { $regex: search, $options: "i" } },
      { "venue.city": { $regex: search, $options: "i" } },
    ];
  }

  if (city) filter["venue.city"] = { $regex: city, $options: "i" };
  if (status) filter.status = status;
  if (featured !== undefined) filter.featured = featured === "true";

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [marathons, total] = await Promise.all([
    Marathon.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
    Marathon.countDocuments(filter),
  ]);

  return {
    marathons,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
};

export const getMarathonBySlug = async (slug) => {
  const marathon = await Marathon.findOne({ slug, status: "published" });
  if (!marathon) {
    throw new AppError("Marathon not found", 404);
  }
  return marathon;
};

export const getMarathonById = async (id) => {
  const marathon = await Marathon.findById(id);
  if (!marathon) {
    throw new AppError("Marathon not found", 404);
  }
  return marathon;
};

export const updateMarathon = async (id, data) => {
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
  const marathon = await Marathon.findByIdAndDelete(id);
  if (!marathon) {
    throw new AppError("Marathon not found", 404);
  }
  return marathon;
};
