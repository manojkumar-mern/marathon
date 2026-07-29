import Registration from "./registration.model.js";
import Marathon from "../marathon/marathon.model.js";
import mongoose from "mongoose";
import { AppError } from "../../utils/AppError.js";
import { escapeRegExp } from "../../utils/regex.js";
import { n8n as n8nService } from "../../automation/n8n.service.js";

export const createRegistration = async (userId, data) => {
  let marathon = null;
  if (mongoose.Types.ObjectId.isValid(data.marathon)) {
    marathon = await Marathon.findById(data.marathon);
  }
  if (!marathon) {
    marathon = await Marathon.findOne({ slug: data.marathon });
  }
  if (!marathon) {
    throw new AppError("Marathon not found", 404);
  }

  if (marathon.status !== "published") {
    throw new AppError("Registration is not available for this marathon", 400);
  }

  const now = new Date();
  if (now < new Date(marathon.registrationStartDate)) {
    throw new AppError("Registration has not opened yet", 400);
  }
  if (now > new Date(marathon.registrationEndDate)) {
    throw new AppError("Registration window has closed", 400);
  }

  let category = marathon.raceCategories.id(data.raceCategoryId);
  if (!category) {
    category = marathon.raceCategories.find(
      (c) => c._id?.toString() === data.raceCategoryId || c.name === data.raceCategoryId
    );
  }
  if (!category) {
    throw new AppError("Selected race category not found in this marathon", 400);
  }

  if (!category.isActive) {
    throw new AppError("This race category is currently unavailable", 400);
  }

  const existing = await Registration.findOne({
    marathon: data.marathon,
    user: userId,
    "raceCategory.categoryId": category._id,
    status: { $in: ["pending", "confirmed"] },
  });
  if (existing) {
    throw new AppError("You are already registered for this race category", 409);
  }

  const categoryCount = await Registration.countDocuments({
    marathon: data.marathon,
    "raceCategory.categoryId": category._id,
    status: { $in: ["pending", "confirmed"] },
  });
  if (categoryCount >= category.maxParticipants) {
    throw new AppError("This race category is fully booked", 400);
  }

  const registration = await Registration.create({
    marathon: data.marathon,
    user: userId,
    raceCategory: {
      categoryId: category._id,
      name: category.name,
      distance: category.distance,
      price: category.price,
    },
    runnerDetails: data.runnerDetails,
    emergencyContact: data.emergencyContact,
    tshirtSize: data.tshirtSize,
    address: data.address,
    medicalInfo: data.medicalInfo,
    payment: {
      amount: category.price,
      currency: category.currency || "INR",
      status: "pending",
    },
  });

  return registration;
};

export const getMyRegistrations = async (userId, query) => {
  const { page = 1, limit = 50, sort = "-createdAt" } = query;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
  const skip = (pageNum - 1) * limitNum;

  const [registrations, total] = await Promise.all([
    Registration.find({ user: userId })
      .populate("marathon", "title slug eventDate venue.city venue.name status")
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Registration.countDocuments({ user: userId }),
  ]);

  return {
    registrations,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
};

export const getRegistrationById = async (id) => {
  const registration = await Registration.findById(id).populate(
    "marathon",
    "title slug eventDate venue.city venue.name status"
  );
  if (!registration) {
    throw new AppError("Registration not found", 404);
  }
  return registration;
};

export const getAllRegistrations = async (query) => {
  const {
    page = 1,
    limit = 50,
    search,
    marathon,
    status,
    sort = "-createdAt",
  } = query;

  const filter = {};

  if (marathon) filter.marathon = marathon;
  if (status) filter.status = status;

  if (search) {
    const escapedSearch = escapeRegExp(search);
    filter.$or = [
      { registrationNumber: { $regex: escapedSearch, $options: "i" } },
      { "runnerDetails.fullName": { $regex: escapedSearch, $options: "i" } },
      { "runnerDetails.email": { $regex: escapedSearch, $options: "i" } },
      { "runnerDetails.phone": { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
  const skip = (pageNum - 1) * limitNum;

  const [registrations, total, statusCounts] = await Promise.all([
    Registration.find(filter)
      .populate("marathon", "title slug eventDate venue.city venue.name")
      .populate("user", "fullName email phone")
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Registration.countDocuments(filter),
    Registration.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const counts = { confirmed: 0, pending: 0, cancelled: 0, withdrawn: 0 };
  for (const s of statusCounts) {
    if (s._id in counts) counts[s._id] = s.count;
  }

  return {
    registrations,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    counts,
  };
};

export const updateRegistration = async (id, data) => {
  const registration = await Registration.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  }).populate("marathon", "title slug eventDate");

  if (!registration) {
    throw new AppError("Registration not found", 404);
  }

  if (data.isCheckedIn === true && !registration.checkedInAt) {
    registration.checkedInAt = new Date();
    await registration.save();
  }

  if (data.isCompleted === true && !registration.completedAt) {
    registration.completedAt = new Date();
    await registration.save();
  }

  return registration;
};

export const deleteRegistration = async (id) => {
  const registration = await Registration.findByIdAndDelete(id);
  if (!registration) {
    throw new AppError("Registration not found", 404);
  }
  return registration;
};
