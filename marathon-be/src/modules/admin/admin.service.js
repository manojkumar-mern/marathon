import Registration from "../registration/registration.model.js";
import Marathon from "../marathon/marathon.model.js";
import Payment from "../../models/Payment.js";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const fillTrend = (data, monthsBack = 12, valueKey = "count") => {
  const now = new Date();
  const map = new Map();
  for (const d of data) {
    const key = `${d.year}-${String(d.month).padStart(2, "0")}`;
    map.set(key, d[valueKey] || 0);
  }
  const result = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    result.push({
      month: monthNames[d.getMonth()],
      year: d.getFullYear(),
      value: map.get(key) || 0,
    });
  }
  return result;
};

export const getDashboardData = async () => {
  const now = new Date();

  const [
    totalEvents,
    totalParticipants,
    paymentAgg,
    monthlyRegistrationTrend,
    monthlyRevenueTrend,
    categoryDist,
    genderDist,
    ageDist,
    upcomingEvents,
    recentRegistrations,
    recentPayments,
  ] = await Promise.all([
    Marathon.countDocuments({ isDeleted: { $ne: true } }),
    Registration.countDocuments({ status: { $in: ["confirmed", "pending"] } }),
    Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),
    Registration.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $project: { _id: 0, year: "$_id.year", month: "$_id.month", count: 1 } },
    ]),
    Payment.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: { year: { $year: "$paidAt" }, month: { $month: "$paidAt" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $project: { _id: 0, year: "$_id.year", month: "$_id.month", amount: 1 } },
    ]),
    Registration.aggregate([
      { $group: { _id: "$raceCategory.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, category: "$_id", count: 1 } },
    ]),
    Registration.aggregate([
      { $group: { _id: "$runnerDetails.gender", count: { $sum: 1 } } },
      { $project: { _id: 0, gender: { $ifNull: ["$_id", "unspecified"] }, count: 1 } },
    ]),
    (async () => {
      const ageNow = new Date();
      return Registration.aggregate([
        { $match: { "runnerDetails.dateOfBirth": { $ne: null } } },
        {
          $addFields: {
            age: {
              $floor: {
                $divide: [
                  { $subtract: [ageNow, "$runnerDetails.dateOfBirth"] },
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
    })(),
    Marathon.find({ eventDate: { $gte: now }, isDeleted: { $ne: true } })
      .select("title eventDate venue slug bannerImage registrationStartDate registrationEndDate status")
      .sort({ eventDate: 1 })
      .limit(5)
      .lean(),
    Registration.find()
      .populate("user", "fullName email")
      .populate("marathon", "title")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    Payment.find()
      .populate("user", "fullName email")
      .populate("marathon", "title")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  let totalRevenue = 0;
  let pendingPayments = 0;
  let successfulPayments = 0;
  let failedPayments = 0;
  const paymentStatusData = [];

  for (const p of paymentAgg) {
    const amount = p.totalAmount || 0;
    if (p._id === "paid") {
      totalRevenue = amount;
      successfulPayments = p.count;
    } else if (p._id === "pending") {
      pendingPayments = p.count;
    } else if (p._id === "failed") {
      failedPayments = p.count;
    }
    paymentStatusData.push({ status: p._id, count: p.count, amount });
  }

  const registrationTrend = fillTrend(monthlyRegistrationTrend);
  const revenueTrend = fillTrend(monthlyRevenueTrend, 12, "amount");

  const upcomingWithDetails = await Promise.all(
    upcomingEvents.map(async (event) => {
      const count = await Registration.countDocuments({ marathon: event._id });
      const diffTime = new Date(event.eventDate) - now;
      const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        _id: event._id,
        title: event.title,
        eventDate: event.eventDate,
        venue: event.venue,
        slug: event.slug,
        bannerImage: event.bannerImage,
        status: event.status,
        registrationCount: count,
        remainingDays: remainingDays > 0 ? remainingDays : 0,
        registrationStartDate: event.registrationStartDate,
        registrationEndDate: event.registrationEndDate,
      };
    })
  );

  const notifications = [];

  for (const p of recentPayments.slice(0, 3)) {
    notifications.push({
      id: `payment-${p._id}`,
      type: "payment",
      message:
        p.status === "paid"
          ? `${p.user?.fullName || "Someone"} paid ₹${p.amount?.toLocaleString("en-IN") || 0}`
          : `${p.user?.fullName || "Someone"}'s payment of ₹${p.amount?.toLocaleString("en-IN") || 0} is ${p.status}`,
      timestamp: p.createdAt,
      read: false,
    });
  }

  for (const r of recentRegistrations.slice(0, 3)) {
    notifications.push({
      id: `reg-${r._id}`,
      type: "registration",
      message: `${r.runnerDetails?.fullName || r.user?.fullName || "Someone"} registered for ${r.marathon?.title || "a marathon"}`,
      timestamp: r.createdAt,
      read: false,
    });
  }

  for (const e of upcomingWithDetails.slice(0, 2)) {
    notifications.push({
      id: `upcoming-${e._id}`,
      type: "reminder",
      message: `"${e.title}" starts in ${e.remainingDays} day${e.remainingDays !== 1 ? "s" : ""}`,
      timestamp: new Date(e.eventDate).toISOString(),
      read: false,
    });
  }

  notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    stats: {
      totalEvents,
      totalParticipants,
      totalRevenue,
      pendingPayments,
      successfulPayments,
      failedPayments,
      upcomingEventsCount: upcomingEvents.length,
      activeParticipants: totalParticipants,
      certificatesGenerated: 0,
    },
    trends: {
      registrations: registrationTrend,
      revenue: revenueTrend,
    },
    paymentStatus: paymentStatusData,
    categoryDistribution: categoryDist.map((c) => ({
      category: c.category || "Uncategorised",
      count: c.count,
    })),
    genderDistribution: genderDist.map((g) => ({
      gender: g.gender || "unspecified",
      count: g.count,
    })),
    ageDistribution: ageDist,
    recentRegistrations: recentRegistrations.map((r) => ({
      _id: r._id,
      registrationNumber: r.registrationNumber,
      fullName: r.runnerDetails?.fullName || r.user?.fullName,
      marathon: r.marathon?.title,
      category: r.raceCategory?.name,
      paymentStatus: r.payment?.status || r.status,
      registrationStatus: r.status,
      createdAt: r.createdAt,
    })),
    recentPayments: recentPayments.map((p) => ({
      _id: p._id,
      transactionId: p.receipt || p.gatewayOrderId || p._id,
      fullName: p.user?.fullName,
      marathon: p.marathon?.title,
      amount: p.amount,
      status: p.status,
      createdAt: p.createdAt,
    })),
    upcomingEvents: upcomingWithDetails,
    notifications,
    systemHealth: {
      api: "operational",
      database: "operational",
      emailQueue: "operational",
      paymentGateway: "operational",
      storage: "operational",
    },
  };
};
