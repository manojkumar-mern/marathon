import { BRAND } from '../config/brand'

/* ─── Navigation ──────────────────────────────────────────────────── */
export const navigationItems = [
  { label: 'Events',     to: '/events' },
  { label: 'Race Guide', to: '/race-categories' },
  { label: 'Locations',  to: '/locations' },
  { label: 'Community',  to: '/gallery' },
]

/* ─── Events ──────────────────────────────────────────────────────── */
export const events = [
  {
    id: 'chennai-marina-42k',
    title: 'Chennai Marina 42K',
    status: 'Registration Open',
    date: 'Jan 18, 2027',
    location: 'Marina Beach, Chennai',
    venue: 'Gandhi Statue, Marina Beach, Chennai',
    distance: 'Full Marathon · Half · 10K · 5K · 3K Fun Run',
    startTime: '5:30 AM',
    regDeadline: 'Jan 5, 2027',
    image:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=85',
    description:
      'Run along one of the world’s longest urban beaches at sunrise. The Chennai Marina 42K takes you through the heart of the city — past iconic landmarks, cheering crowds, and the open sea. Whether you’re chasing a personal best or crossing your first finish line, this is the race to remember.',
    route: {
      terrain: 'Flat coastal road with sea breeze',
      surface: 'Smooth tarmac',
      elevation: '< 25m total gain — certified fast course',
      certified: 'AIMS & AFI certified',
      highlights: ['Marina Beach promenade', 'Anna Salai', 'Napier Bridge', 'Fort St. George', 'Rajaji Salai'],
    },
    schedule: [
      { time: '4:00 AM', activity: 'Venue opens — bib collection & baggage drop' },
      { time: '5:00 AM', activity: 'Pre-race warm-up with pace coaches' },
      { time: '5:30 AM', activity: 'Wave 1 — Full Marathon (42K) start' },
      { time: '6:00 AM', activity: 'Wave 2 — Half Marathon (21K) start' },
      { time: '7:00 AM', activity: 'Wave 3 — 5K Sprint start' },
      { time: '7:30 AM', activity: 'Wave 4 — 3K Fun Run start' },
      { time: '8:00 AM – 2:00 PM', activity: 'Finish zone open — medals, refreshments, photo zone' },
      { time: '2:30 PM', activity: 'Prize ceremony — category winners & top finishers' },
    ],
  },
  {
    id: 'bengaluru-cubbon-21k',
    title: 'Bengaluru Cubbon Half',
    status: 'Coming Soon',
    date: 'Mar 8, 2027',
    location: 'Cubbon Park, Bengaluru',
    venue: 'Cubbon Park Main Gate, Bengaluru',
    distance: 'Half Marathon · 10K · 5K · 3K Fun Run',
    startTime: '6:00 AM',
    regDeadline: 'Feb 20, 2027',
    image:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=85',
    description:
      'Run through Bengaluru’s green heart. The Cubbon Half takes you along shaded boulevards and heritage roads in one of India’s most vibrant cities. The cool morning air and enthusiastic city crowd make this a favourite among runners returning year after year.',
    route: {
      terrain: 'Shaded boulevard with gentle inclines',
      surface: 'Smooth tarmac',
      elevation: '< 60m total gain',
      certified: 'AFI certified',
      highlights: ['Cubbon Park', 'MG Road', 'Brigade Road', 'Vidhana Soudha', 'Lalbagh Botanical Garden'],
    },
    schedule: [
      { time: '4:30 AM', activity: 'Venue opens — bib collection & baggage drop' },
      { time: '5:30 AM', activity: 'Pre-race warm-up with pace coaches' },
      { time: '6:00 AM', activity: 'Wave 1 — Half Marathon (21K) start' },
      { time: '6:30 AM', activity: 'Wave 2 — 10K start' },
      { time: '7:00 AM', activity: 'Wave 3 — 5K Sprint start' },
      { time: '7:30 AM', activity: 'Wave 4 — 3K Fun Run start' },
      { time: '8:00 AM – 1:00 PM', activity: 'Finish zone open — medals, refreshments, photo zone' },
      { time: '1:30 PM', activity: 'Prize ceremony — category winners & top finishers' },
    ],
  },
]

/* ─── Race categories ─────────────────────────────────────────────── */
export const raceCategories = [
  {
    id: 'fun-run',
    title: 'Fun Run',
    distance: '3K',
    detail:
      'The perfect entry point. Walk, jog, or run — bring the whole family and soak in race-day energy without the pressure.',
    pace: 'All ages · No timing',
    featured: false,
    difficulty: 'Beginner',
    price: '₹499',
    startTime: '7:30 AM',
    medal: true,
    certificate: true,
  },
  {
    id: 'sprint',
    title: 'Sprint',
    distance: '5K',
    detail:
      'Fast-paced. Full crowd energy. The perfect starting point for first-timers and speed seekers alike.',
    pace: 'Any pace · All runners',
    featured: false,
    difficulty: 'Easy',
    price: '₹799',
    startTime: '7:00 AM',
    medal: true,
    certificate: true,
  },
  {
    id: 'half',
    title: 'Half Marathon',
    distance: '21K',
    detail:
      'The sweet spot between endurance and speed. A true measure of distance training and race-day form.',
    pace: 'Steady pace · 4–7 min/km',
    featured: false,
    difficulty: 'Moderate',
    price: '₹1,499',
    startTime: '6:00 AM',
    medal: true,
    certificate: true,
  },
  {
    id: 'full',
    title: 'Full Marathon',
    distance: '42K',
    detail:
      'The iconic distance. Every step earned through months of preparation, determination, and dedication.',
    pace: 'Elite & general entry',
    featured: true,
    difficulty: 'Advanced',
    price: '₹2,499',
    startTime: '5:30 AM',
    medal: true,
    certificate: true,
  },
]

/* ─── Gallery ─────────────────────────────────────────────────────── */
export const galleryImages = [
  {
    alt: 'Runners crossing the finish line in jubilation',
    src: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1100&q=85',
    large: true,
    caption: 'Finish Line',
  },
  {
    alt: 'Thousands of runners at the starting gun',
    src: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=700&q=85',
    large: false,
    caption: 'The Start',
  },
  {
    alt: 'Runner receiving a medal from a volunteer',
    src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=85',
    large: false,
    caption: 'Medal Ceremony',
  },
  {
    alt: 'Cheering crowd lining the city marathon route',
    src: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=700&q=85',
    large: false,
    caption: 'Crowd Support',
  },
  {
    alt: 'Runners at a hydration station mid-race',
    src: 'https://images.unsplash.com/photo-1560073744-f1de96c23edc?auto=format&fit=crop&w=700&q=85',
    large: false,
    caption: 'Hydration Point',
  },
  {
    alt: 'Family celebrating at the finish arch',
    src: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=700&q=85',
    large: false,
    caption: 'Family Moments',
  },
]

/* ─── Location cards ──────────────────────────────────────────────── */
export const locationCards = [
  {
    city: 'Chennai',
    label: 'Marina Beach · Full 42K · Half 21K',
    date: 'Jan 18, 2027',
    image:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=85',
    accentColor: '#F97316',
  },
  {
    city: 'Salem',
    label: 'Yercaud Foothills · 10K · 5K',
    date: 'Feb 22, 2027',
    image:
      'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=900&q=85',
    accentColor: '#0EA5E9',
  },
  {
    city: 'Bengaluru',
    label: 'Cubbon Park · Half 21K · 5K',
    date: 'Mar 8, 2027',
    image:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=85',
    accentColor: '#10B981',
  },
]

/* ─── Race Day Journey ────────────────────────────────────────────── */
export const raceDayJourney = [
  {
    step: '01',
    title: 'Register Online',
    detail: 'Pick your distance, complete payment, and receive instant confirmation.',
  },
  {
    step: '02',
    title: 'Receive QR Ticket',
    detail: 'Your digital race ticket with a unique QR code lands in your inbox.',
  },
  {
    step: '03',
    title: 'Collect Your Bib',
    detail: 'Pick up your race bib, timing chip, and event bag at the expo.',
  },
  {
    step: '04',
    title: 'Warm Up',
    detail: 'Join the pre-race warm-up with our pace coaches on the starting grid.',
  },
  {
    step: '05',
    title: 'Race',
    detail: 'Run through iconic city roads with thousands of runners and crowds.',
  },
  {
    step: '06',
    title: 'Cross the Finish',
    detail: 'That feeling when you cross the arch — nothing quite prepares you for it.',
  },
  {
    step: '07',
    title: 'Collect Your Medal',
    detail: 'Every finisher earns a premium medal and an official finisher certificate.',
  },
]

/* ─── Testimonials ────────────────────────────────────────────────── */
export const testimonials = [
  {
    name: 'Priya Krishnamurthy',
    city: 'Chennai',
    category: 'Full Marathon · 42K',
    quote:
      'I crossed the finish line at Marina Beach with tears I didn\'t expect. The organisation was flawless — I never once worried about logistics. I only had to run.',
    rating: 5,
  },
  {
    name: 'Arjun Mehta',
    city: 'Bengaluru',
    category: 'Half Marathon · 21K',
    quote:
      'My second half marathon, and easily the best event I\'ve run. The crowd at Cubbon Park was electric. Already signed up for the full next year.',
    rating: 5,
  },
  {
    name: 'Kavitha Sundaram',
    city: 'Salem',
    category: '5K Sprint · First Race',
    quote:
      'I\'d never run in a race before. The volunteers were incredibly encouraging, and finishing felt like the biggest achievement of my life. I\'ll be back for the half.',
    rating: 5,
  },
]

/* ─── FAQ items ───────────────────────────────────────────────────── */
export const faqItems = [
  [
    'What race distances are available?',
    'We offer four distances: 3K Fun Run, 5K Sprint, 21K Half Marathon, and 42K Full Marathon. Each has its own wave start, dedicated route, and finisher medal. All distances are open to runners of every experience level.',
  ],
  [
    'How do I collect my race bib?',
    'Bib collection is at the event expo — held the day before and on race morning. Bring your QR ticket (available in your participant dashboard) and a valid photo ID. No bib, no race.',
  ],
  [
    'Are timing chips included in registration?',
    'Yes. Every registered participant receives a disposable timing chip attached to their bib. Your official finish time is automatically recorded as you cross the chip mat at the finish arch.',
  ],
  [
    'Can I transfer my registration to another runner?',
    'Transfers are allowed up to 10 days before the event. Submit a transfer request from your participant dashboard. The incoming runner must complete their emergency contact details before the deadline.',
  ],
  [
    'What if I need to withdraw due to injury?',
    'We understand that injuries happen. Withdrawal requests made at least 14 days before the event are eligible for a partial credit toward a future race. Contact our support team as early as possible.',
  ],
  [
    'When will course maps and race-day instructions be published?',
    'Full course maps, elevation profiles, wave start times, water station locations, and race-day briefing documents are published on the event page at least 3 weeks before race day.',
  ],
]

/* ─── Sponsors ────────────────────────────────────────────────────── */
export const sponsors = [
  {
    tier: 'Title',
    name: 'Kauvery Hospital',
    description:
      'India’s leading multi-specialty hospital chain and our proud title partner. Kauvery Hospital provides on-course medical support at every event.',
  },
  { tier: 'Gold', name: 'ASICS India',       description: 'Official footwear partner.' },
  { tier: 'Gold', name: 'Decathlon Sports',   description: 'Official sporting goods partner.' },
  { tier: 'Silver', name: '100XE Energy',     description: 'Official hydration partner.' },
  { tier: 'Silver', name: 'Fitbit India',     description: 'Official fitness tracking partner.' },
  { tier: 'Silver', name: 'Healthify Me',     description: 'Official nutrition & training partner.' },
  { tier: 'Bronze', name: 'Zomato',           description: null },
  { tier: 'Bronze', name: 'Swiggy Instamart', description: null },
  { tier: 'Bronze', name: 'MakeMyTrip',       description: null },
  { tier: 'Bronze', name: 'Apollo Pharmacy',  description: null },
]

/* ─── Static page content ──────────────────────────────────────────────── */
export const pageContent = {
  about: {
    eyebrow: 'Our Story',
    title: 'Built for those who push further.',
    description: `${BRAND.name} was born from one belief: endurance events should be as extraordinary as the athletes who run them. We design every race — from the start gun to the finish arch — to deliver moments worth every mile.`,
    story: [
      'It started with a conversation between a group of runners who felt that the events they loved were being run like logistics exercises — efficient, yes, but missing something essential. They wanted races that felt worthy of the training they put in.',
      `${BRAND.name} launched in 2024 with a single event in Chennai. 800 runners. A borrowed timing system. A finish arch held up by determination. Since then, we’ve grown to twelve events across six Indian cities, and every one of them has kept the same promise: run a race that means something.`,
      'Today we work with a small, dedicated team of event professionals, pace coaches, route designers, and logistics coordinators who believe that race day should be the best day of a runner’s year.',
    ],
    pillars: [
      {
        title: 'Precision at scale',
        detail: 'Wave starts, timing chips, QR check-in, medical coverage — every operational detail is designed to hold under the pressure of thousands of runners on the same road.',
      },
      {
        title: 'Routes worth running',
        detail: 'Every city edition is mapped for drama, character, and crowd support. We scout locations for months before committing to a route.',
      },
      {
        title: 'Community over competition',
        detail: 'Our races welcome first-timers and elite runners on the same start line. The finish arch belongs to everyone who crosses it.',
      },
    ],
    team: [
      { name: 'Anand Raghunathan',  role: 'Co-Founder & Race Director',  note: 'Former national-level marathon runner with 15+ years of event management experience.' },
      { name: 'Deepa Krishnaswamy', role: 'Co-Founder & Head of Operations', note: 'Logistics specialist who has directed large-scale public events across South India.' },
      { name: 'Vikram Seshadri',    role: 'Head of Technology',          note: 'Built the registration and timing infrastructure from the ground up.' },
    ],
  },
  schedule: {
    eyebrow: 'Race Schedule',
    title: 'Mark your calendar.',
    description:
      'Full event schedules, race briefings, wave starts, and participant instructions are published here for each confirmed event.',
  },
  sponsors: {
    eyebrow: 'Partnerships',
    title: 'Move communities. Build loyalty.',
    description: `${BRAND.name} partners with brands that believe in the power of movement — to build genuine connection, deep loyalty, and lasting community impact.`,
  },
  contact: {
    eyebrow: 'Get in Touch',
    title: "Let’s build the next start line.",
    description:
      'For event collaboration, participant support, partnership opportunities, and media enquiries — our team is here.',
  },
}
