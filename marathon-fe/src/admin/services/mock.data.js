/**
 * STRIDEFORGE — Admin Mock Data
 * ─────────────────────────────────────────────────────────────────
 * Provides realistic fallback data for the admin dashboard when the
 * backend API is unavailable (local dev, CI, offline demo).
 *
 * Events match the actual platform events: Chennai, Salem, Bengaluru.
 * All monetary values are in INR (whole rupees).
 * ─────────────────────────────────────────────────────────────────
 */

import eventChennai   from '../../assets/images/events/chennai-marina.webp'
import eventSalem     from '../../assets/images/events/salem-yercaud.webp'
import eventBengaluru from '../../assets/images/events/bengaluru-cubbon park.webp'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function makeMonthSeries(values) {
  return MONTHS.map((month, i) => ({ month, value: values[i] }))
}

// ─── KPI Stats ────────────────────────────────────────────────────
export const MOCK_STATS = {
  totalEvents:           3,
  activeParticipants:    15,
  totalRevenue:      27_450,
  pendingPayments:        4,
  successfulPayments:    11,
  failedPayments:         0,
  upcomingEventsCount:    3,
  certificatesGenerated:  0,
}

// ─── Trend Series ─────────────────────────────────────────────────
export const MOCK_TRENDS = {
  registrations: makeMonthSeries([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15]),
  revenue:       makeMonthSeries([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27_450]),
}

// ─── Payment Status Distribution ──────────────────────────────────
export const MOCK_PAYMENT_STATUS = [
  { status: 'paid',    count: 11 },
  { status: 'pending', count:  4 },
  { status: 'failed',  count:  0 },
]

// ─── Category Distribution ────────────────────────────────────────
export const MOCK_CATEGORY_DISTRIBUTION = [
  { category: '10K',           count: 7 },
  { category: '5K',            count: 4 },
  { category: 'Half Marathon', count: 3 },
  { category: '3K Fun Run',    count: 1 },
]

// ─── Gender Distribution ──────────────────────────────────────────
export const MOCK_GENDER_DISTRIBUTION = [
  { gender: 'male',   count: 9 },
  { gender: 'female', count: 6 },
]

// ─── Age Group Distribution ───────────────────────────────────────
export const MOCK_AGE_DISTRIBUTION = [
  { group: '18–25', count: 4 },
  { group: '26–35', count: 6 },
  { group: '36–45', count: 4 },
  { group: '46–60', count: 1 },
]

// ─── T-Shirt Size Report ──────────────────────────────────────────
export const MOCK_TSHIRT_SIZES = [
  { size: 'XS',  count: 0 },
  { size: 'S',   count: 2 },
  { size: 'M',   count: 5 },
  { size: 'L',   count: 4 },
  { size: 'XL',  count: 3 },
  { size: 'XXL', count: 1 },
  { size: '3XL', count: 0 },
]

// ─── 15 Mock Participants ─────────────────────────────────────────
export const MOCK_PARTICIPANTS = [
  { _id: 'p01', registrationNumber: 'REG-2027-00001', status: 'confirmed', runnerDetails: { fullName: 'Arjun Krishnamurthy', email: 'arjun.k@gmail.com', phone: '9876543210', gender: 'male'   }, marathon: { title: 'Chennai Marina 42K' }, raceCategory: { name: '10K',           distance: '10K' }, tshirtSize: 'L',   payment: { status: 'completed', amount: 999  }, createdAt: '2027-01-05T08:14:00Z' },
  { _id: 'p02', registrationNumber: 'REG-2027-00002', status: 'confirmed', runnerDetails: { fullName: 'Priya Sundarajan',    email: 'priya.s@gmail.com',    phone: '9865432107', gender: 'female' }, marathon: { title: 'Chennai Marina 42K' }, raceCategory: { name: 'Half Marathon', distance: '21K' }, tshirtSize: 'S',   payment: { status: 'completed', amount: 1499 }, createdAt: '2027-01-06T10:32:00Z' },
  { _id: 'p03', registrationNumber: 'REG-2027-00003', status: 'pending',   runnerDetails: { fullName: 'Karthik Selvam',      email: 'karthik.s@gmail.com',  phone: '9754321086', gender: 'male'   }, marathon: { title: 'Salem Yercaud Run'  }, raceCategory: { name: '5K',            distance: '5K'  }, tshirtSize: 'M',   payment: { status: 'pending',   amount: 799  }, createdAt: '2027-01-07T09:00:00Z' },
  { _id: 'p04', registrationNumber: 'REG-2027-00004', status: 'confirmed', runnerDetails: { fullName: 'Divya Rajan',         email: 'divya.r@gmail.com',    phone: '9643210975', gender: 'female' }, marathon: { title: 'Bengaluru Cubbon Half' }, raceCategory: { name: 'Half Marathon', distance: '21K' }, tshirtSize: 'M',   payment: { status: 'completed', amount: 1499 }, createdAt: '2027-01-07T11:50:00Z' },
  { _id: 'p05', registrationNumber: 'REG-2027-00005', status: 'confirmed', runnerDetails: { fullName: 'Venkat Narayanan',    email: 'venkat.n@gmail.com',   phone: '9532109864', gender: 'male'   }, marathon: { title: 'Chennai Marina 42K' }, raceCategory: { name: '10K',           distance: '10K' }, tshirtSize: 'XL',  payment: { status: 'completed', amount: 999  }, createdAt: '2027-01-08T07:22:00Z' },
  { _id: 'p06', registrationNumber: 'REG-2027-00006', status: 'confirmed', runnerDetails: { fullName: 'Meera Balakrishnan',  email: 'meera.b@gmail.com',    phone: '9421098753', gender: 'female' }, marathon: { title: 'Salem Yercaud Run'  }, raceCategory: { name: '10K',           distance: '10K' }, tshirtSize: 'S',   payment: { status: 'completed', amount: 999  }, createdAt: '2027-01-08T14:48:00Z' },
  { _id: 'p07', registrationNumber: 'REG-2027-00007', status: 'confirmed', runnerDetails: { fullName: 'Suresh Babu',         email: 'suresh.b@gmail.com',   phone: '9310987642', gender: 'male'   }, marathon: { title: 'Bengaluru Cubbon Half' }, raceCategory: { name: '10K',           distance: '10K' }, tshirtSize: 'L',   payment: { status: 'completed', amount: 999  }, createdAt: '2027-01-09T06:10:00Z' },
  { _id: 'p08', registrationNumber: 'REG-2027-00008', status: 'pending',   runnerDetails: { fullName: 'Anjali Nair',         email: 'anjali.n@gmail.com',   phone: '9209876531', gender: 'female' }, marathon: { title: 'Chennai Marina 42K' }, raceCategory: { name: '5K',            distance: '5K'  }, tshirtSize: 'M',   payment: { status: 'pending',   amount: 799  }, createdAt: '2027-01-09T16:30:00Z' },
  { _id: 'p09', registrationNumber: 'REG-2027-00009', status: 'confirmed', runnerDetails: { fullName: 'Rohan Deshpande',     email: 'rohan.d@gmail.com',    phone: '9198765420', gender: 'male'   }, marathon: { title: 'Salem Yercaud Run'  }, raceCategory: { name: '5K',            distance: '5K'  }, tshirtSize: 'XL',  payment: { status: 'completed', amount: 799  }, createdAt: '2027-01-10T08:55:00Z' },
  { _id: 'p10', registrationNumber: 'REG-2027-00010', status: 'confirmed', runnerDetails: { fullName: 'Kavitha Sundaram',    email: 'kavitha.s@gmail.com',  phone: '9087654319', gender: 'female' }, marathon: { title: 'Chennai Marina 42K' }, raceCategory: { name: '10K',           distance: '10K' }, tshirtSize: 'M',   payment: { status: 'completed', amount: 999  }, createdAt: '2027-01-10T11:20:00Z' },
  { _id: 'p11', registrationNumber: 'REG-2027-00011', status: 'pending',   runnerDetails: { fullName: 'Vikram Rajan',        email: 'vikram.r@gmail.com',   phone: '8976543218', gender: 'male'   }, marathon: { title: 'Bengaluru Cubbon Half' }, raceCategory: { name: '5K',            distance: '5K'  }, tshirtSize: 'L',   payment: { status: 'pending',   amount: 799  }, createdAt: '2027-01-11T09:40:00Z' },
  { _id: 'p12', registrationNumber: 'REG-2027-00012', status: 'confirmed', runnerDetails: { fullName: 'Lakshmi Venkatesh',   email: 'lakshmi.v@gmail.com',  phone: '8865432107', gender: 'female' }, marathon: { title: 'Chennai Marina 42K' }, raceCategory: { name: 'Half Marathon', distance: '21K' }, tshirtSize: 'M',   payment: { status: 'completed', amount: 1499 }, createdAt: '2027-01-11T13:15:00Z' },
  { _id: 'p13', registrationNumber: 'REG-2027-00013', status: 'confirmed', runnerDetails: { fullName: 'Aditya Sharma',       email: 'aditya.s@gmail.com',   phone: '8754321096', gender: 'male'   }, marathon: { title: 'Salem Yercaud Run'  }, raceCategory: { name: '3K Fun Run',    distance: '3K'  }, tshirtSize: 'S',   payment: { status: 'completed', amount: 499  }, createdAt: '2027-01-12T07:05:00Z' },
  { _id: 'p14', registrationNumber: 'REG-2027-00014', status: 'confirmed', runnerDetails: { fullName: 'Nithya Krishnan',     email: 'nithya.k@gmail.com',   phone: '8643210985', gender: 'female' }, marathon: { title: 'Bengaluru Cubbon Half' }, raceCategory: { name: '10K',           distance: '10K' }, tshirtSize: 'XL',  payment: { status: 'completed', amount: 999  }, createdAt: '2027-01-12T15:40:00Z' },
  { _id: 'p15', registrationNumber: 'REG-2027-00015', status: 'pending',   runnerDetails: { fullName: 'Ramesh Kumar',        email: 'ramesh.k@gmail.com',   phone: '8532109874', gender: 'male'   }, marathon: { title: 'Chennai Marina 42K' }, raceCategory: { name: '10K',           distance: '10K' }, tshirtSize: 'XXL', payment: { status: 'pending',   amount: 999  }, createdAt: '2027-01-13T08:00:00Z' },
]

// ─── Recent Registrations (last 6) ────────────────────────────────
export const MOCK_RECENT_REGISTRATIONS = MOCK_PARTICIPANTS.slice(-6).reverse().map((p) => ({
  _id:            p._id,
  fullName:       p.runnerDetails.fullName,
  marathon:       p.marathon.title,
  category:       p.raceCategory.name,
  createdAt:      p.createdAt,
  paymentStatus:  p.payment.status,
}))

// ─── Recent Payments ──────────────────────────────────────────────
export const MOCK_RECENT_PAYMENTS = [
  { _id: 'pay01', transactionId: 'TXN-2027-001', fullName: 'Arjun Krishnamurthy', amount:  999, status: 'paid',    createdAt: '2027-01-05T08:14:00Z' },
  { _id: 'pay02', transactionId: 'TXN-2027-002', fullName: 'Priya Sundarajan',    amount: 1499, status: 'paid',    createdAt: '2027-01-06T10:32:00Z' },
  { _id: 'pay03', transactionId: 'TXN-2027-003', fullName: 'Karthik Selvam',      amount:  799, status: 'pending', createdAt: '2027-01-07T09:00:00Z' },
  { _id: 'pay04', transactionId: 'TXN-2027-004', fullName: 'Divya Rajan',         amount: 1499, status: 'paid',    createdAt: '2027-01-07T11:50:00Z' },
  { _id: 'pay05', transactionId: 'TXN-2027-005', fullName: 'Venkat Narayanan',    amount:  999, status: 'paid',    createdAt: '2027-01-08T07:22:00Z' },
]

// ─── Upcoming Events (with real images) ───────────────────────────
const nowMs = Date.now()
export const MOCK_UPCOMING_EVENTS = [
  {
    _id:               'ev-chennai',
    title:             'Chennai Marina 42K',
    eventDate:         '2027-01-18T00:00:00Z',
    bannerImage:       eventChennai,
    remainingDays:     Math.ceil((new Date('2027-01-18').getTime() - nowMs) / 86400000),
    registrationCount: 7,
    venue:             { city: 'Chennai' },
  },
  {
    _id:               'ev-salem',
    title:             'Salem Yercaud Run',
    eventDate:         '2027-02-22T00:00:00Z',
    bannerImage:       eventSalem,
    remainingDays:     Math.ceil((new Date('2027-02-22').getTime() - nowMs) / 86400000),
    registrationCount: 4,
    venue:             { city: 'Salem' },
  },
  {
    _id:               'ev-bengaluru',
    title:             'Bengaluru Cubbon Half',
    eventDate:         '2027-03-08T00:00:00Z',
    bannerImage:       eventBengaluru,
    remainingDays:     Math.ceil((new Date('2027-03-08').getTime() - nowMs) / 86400000),
    registrationCount: 4,
    venue:             { city: 'Bengaluru' },
  },
]

// ─── Notifications ────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'registration', message: 'Ramesh Kumar registered for Chennai Marina 42K',        timestamp: '2027-01-13T08:00:00Z', read: false },
  { id: 'n2', type: 'registration', message: 'Nithya Krishnan registered for Bengaluru Cubbon Half',  timestamp: '2027-01-12T15:40:00Z', read: false },
  { id: 'n3', type: 'payment',      message: 'Lakshmi Venkatesh paid ₹1,499 for Half Marathon',       timestamp: '2027-01-11T13:15:00Z', read: false },
  { id: 'n4', type: 'event',        message: 'Chennai Marina 42K — Registration closes Jan 5, 2027',  timestamp: '2027-01-05T06:00:00Z', read: true  },
  { id: 'n5', type: 'system',       message: 'All systems operational',                                timestamp: '2027-01-01T00:00:00Z', read: true  },
]

// ─── System Health ────────────────────────────────────────────────
export const MOCK_SYSTEM_HEALTH = {
  api:            'operational',
  database:       'operational',
  emailQueue:     'operational',
  paymentGateway: 'operational',
  storage:        'operational',
}

// ─── Complete Dashboard Response ──────────────────────────────────
export const MOCK_DASHBOARD_DATA = {
  stats:                MOCK_STATS,
  trends:               MOCK_TRENDS,
  paymentStatus:        MOCK_PAYMENT_STATUS,
  categoryDistribution: MOCK_CATEGORY_DISTRIBUTION,
  genderDistribution:   MOCK_GENDER_DISTRIBUTION,
  ageDistribution:      MOCK_AGE_DISTRIBUTION,
  recentRegistrations:  MOCK_RECENT_REGISTRATIONS,
  recentPayments:       MOCK_RECENT_PAYMENTS,
  upcomingEvents:       MOCK_UPCOMING_EVENTS,
  notifications:        MOCK_NOTIFICATIONS,
  systemHealth:         MOCK_SYSTEM_HEALTH,
}
