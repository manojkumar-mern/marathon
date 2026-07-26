import User from "../../models/User.js";
import Marathon from "../marathon/marathon.model.js";
import Registration from "../registration/registration.model.js";

const todayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const todayEnd = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

export const getStats = async () => {
  const now = new Date();

  const [
    totalUsers,
    totalMarathons,
    publishedMarathons,
    upcomingMarathons,
    completedMarathons,
    totalRegistrations,
    confirmedRegistrations,
    pendingRegistrations,
    cancelledRegistrations,
    todaysRegistrations,
  ] = await Promise.all([
    User.countDocuments(),
    Marathon.countDocuments(),
    Marathon.countDocuments({ status: "published" }),
    Marathon.countDocuments({ eventDate: { $gte: now }, status: "published" }),
    Marathon.countDocuments({ status: "completed" }),
    Registration.countDocuments(),
    Registration.countDocuments({ status: "confirmed" }),
    Registration.countDocuments({ status: "pending" }),
    Registration.countDocuments({ status: "cancelled" }),
    Registration.countDocuments({
      createdAt: { $gte: todayStart(), $lte: todayEnd() },
    }),
  ]);

  return {
    totalUsers,
    totalMarathons,
    publishedMarathons,
    upcomingMarathons,
    completedMarathons,
    totalRegistrations,
    confirmedRegistrations,
    pendingRegistrations,
    cancelledRegistrations,
    todaysRegistrations,
  };
};

export const getRecentActivity = async () => {
  const [latestUsers, latestRegistrations, latestMarathons] = await Promise.all([
    User.find().sort({ createdAt: -1 }).limit(5).lean(),
    Registration.find()
      .populate("marathon", "title slug")
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Marathon.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return { latestUsers, latestRegistrations, latestMarathons };
};

export const getRegistrationsPerMarathon = async () => {
  const data = await Registration.aggregate([
    { $group: { _id: "$marathon", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    {
      $lookup: {
        from: "marathons",
        localField: "_id",
        foreignField: "_id",
        as: "marathon",
      },
    },
    { $unwind: "$marathon" },
    {
      $project: {
        _id: 0,
        marathonId: "$marathon._id",
        title: "$marathon.title",
        slug: "$marathon.slug",
        count: 1,
      },
    },
  ]);

  return data;
};

export const getRegistrationsPerCategory = async () => {
  const data = await Registration.aggregate([
    { $group: { _id: "$raceCategory.name", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
      },
    },
  ]);

  return data;
};

export const getGenderDistribution = async () => {
  const data = await Registration.aggregate([
    { $group: { _id: "$runnerDetails.gender", count: { $sum: 1 } } },
    {
      $project: {
        _id: 0,
        gender: { $ifNull: ["$_id", "unspecified"] },
        count: 1,
      },
    },
  ]);

  return data;
};

export const getAgeDistribution = async () => {
  const now = new Date();
  const data = await Registration.aggregate([
    {
      $match: { "runnerDetails.dateOfBirth": { $ne: null } },
    },
    {
      $addFields: {
        age: {
          $floor: {
            $divide: [
              { $subtract: [now, "$runnerDetails.dateOfBirth"] },
              365.25 * 24 * 60 * 60 * 1000,
            ],
          },
        },
      },
    },
    {
      $bucket: {
        groupBy: "$age",
        boundaries: [0, 19, 26, 36, 46, 61, Infinity],
        default: "unknown",
        output: { count: { $sum: 1 } },
      },
    },
    {
      $project: {
        _id: 0,
        group: {
          $switch: {
            branches: [
              { case: { $eq: ["$_id", 0] }, then: "0-18" },
              { case: { $eq: ["$_id", 19] }, then: "19-25" },
              { case: { $eq: ["$_id", 26] }, then: "26-35" },
              { case: { $eq: ["$_id", 36] }, then: "36-45" },
              { case: { $eq: ["$_id", 46] }, then: "46-60" },
              { case: { $eq: ["$_id", 61] }, then: "60+" },
            ],
            default: "unknown",
          },
        },
        count: 1,
      },
    },
  ]);

  return data;
};

export const getMonthlyTrend = async () => {
  const data = await Registration.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        count: 1,
        label: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            {
              $cond: {
                if: { $lt: ["$_id.month", 10] },
                then: { $concat: ["0", { $toString: "$_id.month" }] },
                else: { $toString: "$_id.month" },
              },
            },
          ],
        },
      },
    },
  ]);

  return data;
};

export const getMarathonOverview = async (marathonId) => {
  const marathon = await Marathon.findById(marathonId).lean();
  if (!marathon) return null;

  const registrations = await Registration.find({
    marathon: marathonId,
    status: { $in: ["pending", "confirmed"] },
  })
    .select("raceCategory")
    .lean();

  const participantCount = registrations.length;
  const totalCapacity = marathon.raceCategories.reduce(
    (sum, c) => sum + c.maxParticipants,
    0
  );
  const registrationPercent =
    totalCapacity > 0
      ? Math.round((participantCount / totalCapacity) * 100)
      : 0;

  const categoryOccupancy = marathon.raceCategories.map((cat) => {
    const count = registrations.filter(
      (r) => r.raceCategory.categoryId.toString() === cat._id.toString()
    ).length;
    return {
      name: cat.name,
      distance: cat.distance,
      maxParticipants: cat.maxParticipants,
      registered: count,
      remaining: cat.maxParticipants - count,
      occupancyPercent:
        cat.maxParticipants > 0
          ? Math.round((count / cat.maxParticipants) * 100)
          : 0,
    };
  });

  return {
    marathon: {
      _id: marathon._id,
      title: marathon.title,
      slug: marathon.slug,
      eventDate: marathon.eventDate,
      status: marathon.status,
      venue: marathon.venue,
    },
    participantCount,
    totalCapacity,
    registrationPercent,
    categoryOccupancy,
  };
};
