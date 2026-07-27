/**
 * STRIDEFORGE — Admin Mock Data
 * ─────────────────────────────────────────────────────────────────
 * Provides realistic fallback data for the admin dashboard when the
 * backend API is unavailable (local dev, CI, offline demo).
 *
 * All monetary values are in INR paisa-free (whole rupees).
 * Dates are ISO-8601 strings relative to the year 2026.
 * ─────────────────────────────────────────────────────────────────
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function makeMonthSeries(values) {
  return MONTHS.map((month, i) => ({ month, value: values[i] }))
}

// ─── KPI Stats ────────────────────────────────────────────────────
export const MOCK_STATS = {
  totalEvents:           12,
  activeParticipants:  4_872,
  totalRevenue:      9_744_000,
  pendingPayments:       143,
  successfulPayments:  4_601,
  failedPayments:        128,
  upcomingEventsCount:     4,
  certificatesGenerated: 3_210,
}

// ─── Trend Series ─────────────────────────────────────────────────
export const MOCK_TRENDS = {
  registrations: makeMonthSeries([120, 185, 240, 310, 420, 510, 680, 730, 820, 950, 1_100, 1_280]),
  revenue:       makeMonthSeries([
    480_000, 740_000, 960_000, 1_240_000, 1_680_000, 2_040_000,
    2_720_000, 2_920_000, 3_280_000, 3_800_000, 4_400_000, 5_120_000,
  ]),
}

// ─── Payment Status Distribution ──────────────────────────────────
export const MOCK_PAYMENT_STATUS = [
  { status: 'paid',      count: 4_601 },
  { status: 'pending',   count:   143 },
  { status: 'failed',    count:   128 },
  { status: 'cancelled', count:    56 },
  { status: 'refunded',  count:    22 },
]

// ─── Category Distribution ────────────────────────────────────────
export const MOCK_CATEGORY_DISTRIBUTION = [
  { category: '5K',        count: 1_420 },
  { category: '10K',       count: 1_840 },
  { category: 'Half Marathon', count: 980 },
  { category: 'Full Marathon', count: 420 },
  { category: 'Kids Run',  count:   212 },
]

// ─── Gender Distribution ──────────────────────────────────────────
export const MOCK_GENDER_DISTRIBUTION = [
  { gender: 'male',   count: 2_980 },
  { gender: 'female', count: 1_784 },
  { gender: 'other',  count:   108 },
]

// ─── Age Group Distribution ───────────────────────────────────────
export const MOCK_AGE_DISTRIBUTION = [
  { group: 'Under 18', count:  312 },
  { group: '18–25',    count: 1_104 },
  { group: '26–35',    count: 1_840 },
  { group: '36–45',    count:  980 },
  { group: '46–55',    count:  480 },
  { group: '55+',      count:  156 },
]

// ─── Recent Registrations ─────────────────────────────────────────
export const MOCK_RECENT_REGISTRATIONS = [
  { _id: 'r1', fullName: 'Arjun Krishnamurthy', marathon: 'Chennai City Marathon 2026', category: '10K',        createdAt: '2026-07-25T08:14:00Z', paymentStatus: 'paid'    },
  { _id: 'r2', fullName: 'Priya Sundarajan',    marathon: 'Salem Heritage Run 2026',   category: 'Half Marathon', createdAt: '2026-07-24T17:32:00Z', paymentStatus: 'paid'    },
  { _id: 'r3', fullName: 'Karthik Selvam',      marathon: 'Chennai City Marathon 2026', category: '5K',         createdAt: '2026-07-24T12:05:00Z', paymentStatus: 'pending' },
  { _id: 'r4', fullName: 'Divya Rajan',         marathon: 'Bengaluru Ultra 2026',      category: 'Full Marathon', createdAt: '2026-07-23T09:50:00Z', paymentStatus: 'paid'    },
  { _id: 'r5', fullName: 'Venkat Narayanan',    marathon: 'Chennai City Marathon 2026', category: '10K',        createdAt: '2026-07-23T07:22:00Z', paymentStatus: 'failed'  },
  { _id: 'r6', fullName: 'Meera Balakrishnan',  marathon: 'Salem Heritage Run 2026',   category: 'Kids Run',    createdAt: '2026-07-22T14:48:00Z', paymentStatus: 'paid'    },
]

// ─── Recent Payments ──────────────────────────────────────────────
export const MOCK_RECENT_PAYMENTS = [
  { _id: 'p1', transactionId: 'TXN-8842193', fullName: 'Arjun Krishnamurthy', amount: 1_499, status: 'paid',    createdAt: '2026-07-25T08:14:00Z' },
  { _id: 'p2', transactionId: 'TXN-8842041', fullName: 'Priya Sundarajan',    amount: 2_999, status: 'paid',    createdAt: '2026-07-24T17:32:00Z' },
  { _id: 'p3', transactionId: 'TXN-8841887', fullName: 'Karthik Selvam',      amount: 799,   status: 'pending', createdAt: '2026-07-24T12:05:00Z' },
  { _id: 'p4', transactionId: 'TXN-8841720', fullName: 'Divya Rajan',         amount: 4_999, status: 'paid',    createdAt: '2026-07-23T09:50:00Z' },
  { _id: 'p5', transactionId: 'TXN-8841609', fullName: 'Venkat Narayanan',    amount: 1_499, status: 'failed',  createdAt: '2026-07-23T07:22:00Z' },
]

// ─── Upcoming Events ──────────────────────────────────────────────
export const MOCK_UPCOMING_EVENTS = [
  {
    _id:               'e1',
    title:             'Chennai City Marathon 2026',
    eventDate:         '2026-09-14T04:00:00Z',
    bannerImage:       null,
    remainingDays:     49,
    registrationCount: 1_840,
  },
  {
    _id:               'e2',
    title:             'Salem Heritage Run 2026',
    eventDate:         '2026-10-05T05:00:00Z',
    bannerImage:       null,
    remainingDays:     70,
    registrationCount: 620,
  },
  {
    _id:               'e3',
    title:             'Bengaluru Ultra 2026',
    eventDate:         '2026-11-22T04:30:00Z',
    bannerImage:       null,
    remainingDays:    118,
    registrationCount: 412,
  },
]

// ─── Notifications ────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { _id: 'n1', type: 'registration', message: '24 new registrations in the last hour',    createdAt: '2026-07-27T10:50:00Z', read: false },
  { _id: 'n2', type: 'payment',      message: 'Payment gateway latency spike detected',   createdAt: '2026-07-27T09:30:00Z', read: false },
  { _id: 'n3', type: 'system',       message: 'Backup completed successfully',            createdAt: '2026-07-27T06:00:00Z', read: true  },
  { _id: 'n4', type: 'certificate',  message: '3,210 certificates ready for download',    createdAt: '2026-07-26T18:20:00Z', read: true  },
  { _id: 'n5', type: 'event',        message: 'Salem Heritage Run registration is live',  createdAt: '2026-07-26T12:00:00Z', read: true  },
]

// ─── System Health ────────────────────────────────────────────────
export const MOCK_SYSTEM_HEALTH = {
  api:            'operational',
  database:       'operational',
  emailQueue:     'operational',
  paymentGateway: 'degraded',
  storage:        'operational',
}

// ─── Complete Dashboard Response ──────────────────────────────────
export const MOCK_DASHBOARD_DATA = {
  stats:                 MOCK_STATS,
  trends:                MOCK_TRENDS,
  paymentStatus:         MOCK_PAYMENT_STATUS,
  categoryDistribution:  MOCK_CATEGORY_DISTRIBUTION,
  genderDistribution:    MOCK_GENDER_DISTRIBUTION,
  ageDistribution:       MOCK_AGE_DISTRIBUTION,
  recentRegistrations:   MOCK_RECENT_REGISTRATIONS,
  recentPayments:        MOCK_RECENT_PAYMENTS,
  upcomingEvents:        MOCK_UPCOMING_EVENTS,
  notifications:         MOCK_NOTIFICATIONS,
  systemHealth:          MOCK_SYSTEM_HEALTH,
}
