import { BRAND } from '../config/brand'
import {
  eventChennai, eventSalem, eventBengaluru,
  galleryFinishLine, galleryStartLine, galleryMedalCeremony, communityCrowdSupport, communityHydration, galleryFamilyFinish,
  clubChennai, clubSalem, clubBengaluru,
  locationChennai, locationSalem, locationBengaluru,
} from '../assets/images/index.js'

/* ─── Navigation ──────────────────────────────────────────────────── */
export const navigationItems = [
  { label: 'Events',     to: '/events' },
  { label: 'Race Guide', to: '/race-categories' },
  { label: 'Locations',  to: '/locations' },
  { label: 'Community',  to: '/gallery' },
]

/* ─── Venue details per city ─────────────────────────────────────── */
export const venueDetails = {
  chennai: {
    venue: 'Gandhi Statue, Marina Beach, Chennai',
    routeHighlights: ['Marina Beach promenade (6 km shoreline)', 'Napier Bridge — city landmark', 'Fort St. George — historic fort', 'Rajaji Salai — sea-facing stretch', 'Anna Salai — cheering corridor', 'Santhome Cathedral — architectural gem'],
    parking: [
      'Marina Parking Lot (500+ vehicles) — Gate 1 entry',
      'Santhome High Road — Park & Walk (10 min to start)',
      'Valluvar Kottam — shuttle available from 4:00 AM',
    ],
    publicTransport: {
      nearestStation: 'Chennai Central — 6 km',
      busRoutes: ['Route 19B, 21G — direct to Marina', 'Route 45C — from T. Nagar', 'Shuttle buses from Central, Egmore every 20 min from 3:30 AM'],
      info: 'Metro service extended to 1:00 AM on race day. Ola/Uber drop-off at Gate 3.',
    },
    hotels: [
      'The Raintree Hotel — 1.2 km (10% runner discount)',
      'Hotel Marina Residency — 500 m from start line',
      'ITC Grand Chola — 4 km (premium)',
      'ZO Rooms Marina — budget, 800 m',
    ],
    medicalSupport: 'Kauvery Hospital mobile units at every km marker. Defibrillators at km 5, 10, 21, 32, 40. Ambulance bay at finish zone.',
    waterStations: 'Hydration stations every 2 km. Electrolyte drinks at km 5, 10, 15, 21, 30, 37. Sponge stations at km 8, 18, 28.',
  },
  salem: {
    venue: 'Yercaud Foothills Start Point, Salem',
    routeHighlights: ['Yercaud Ghat Road — scenic climb', 'Kottai Mariamman Temple stretch', 'Salem Steel Plant bypass', 'Mettur Road — rural charm', 'Anna Park junction', 'Five Roads roundabout'],
    parking: [
      'Salem Junction Parking — 2 km, free shuttle',
      'Collectorate Grounds — 800 spaces',
      'Sooramangalam — Park & Ride',
    ],
    publicTransport: {
      nearestStation: 'Salem Junction — 3 km',
      busRoutes: ['Route 1, 7, 12 — from bus stand', 'Town buses every 10 min from 5:00 AM'],
      info: 'Special race-day buses from major junctions. Auto-rickshaws available from railway station.',
    },
    hotels: [
      'Hotel Salem Tower — 1.5 km (runner package)',
      'GRT Regency Salem — 2 km',
      'Hotel Cennet — 800 m from start',
    ],
    medicalSupport: 'Government Hospital partnership. Medical tents at start, finish, and mid-point. Ambulance on standby.',
    waterStations: 'Water every 2 km. ORS at km 4, 8, 12. Cooling mist sprays at km 6 and 10.',
  },
  bengaluru: {
    venue: 'Cubbon Park Main Gate, Bengaluru',
    routeHighlights: ['Cubbon Park — green canopy', 'MG Road — city pulse', 'Brigade Road — vibrant stretch', 'Vidhana Soudha — state legislature', 'Lalbagh Lake view', 'Race Course Road'],
    parking: [
      'Cubbon Park Underground Parking — 2,000 vehicles',
      'Minsk Square — 500 m walk',
      'Bangalore Club parking (limited)',
    ],
    publicTransport: {
      nearestStation: 'Cubbon Park Metro (Purple Line) — 200 m',
      busRoutes: ['BMTC Route 288, 333G, 401K', 'Vajra Volvo services from all zones'],
      info: 'Metro starts at 4:00 AM on race day. Namma Yatri app pickup zone at Anil Kumble Circle.',
    },
    hotels: [
      'The Chancery Pavilion — 600 m (15% runner discount)',
      'Hotel Ajantha — 300 m, budget',
      'ITC Gardenia — 1.5 km (luxury)',
      'Bloom Rooms MG Road — 400 m',
    ],
    medicalSupport: 'Multi-specialty team from Apollo Hospitals. 6 medical aid posts along route. Bike medics on course.',
    waterStations: 'Hydration every 2 km. Electrolytes at km 5, 10, 15. Ice towels at km 8 and 16.',
  },
}

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
    image: eventChennai,
    totalSlots: 3000,
    slotsRemaining: 1200,
    price: '₹499 – ₹2,499',
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
    raceKit: ['Premium cotton race T-shirt (your selected size)', 'Timing chip integrated bib', 'Goodie bag with samples from partners', 'Event wristband', 'Race-day guide booklet', 'Tattoo sleeve & face sticker'],
    rules: [
      'All participants must wear the official race bib visibly on the front of their shirt.',
      'Headphones are discouraged — if used, bone conduction only. Be aware of your surroundings.',
      'Pacers, bicycles, skateboards, and pets are not permitted on the course.',
      'Runners must start within their designated wave. Late starters will be directed to the final wave.',
      'Cut-off time for Full Marathon: 6 hours 30 min (12:00 PM). Half Marathon: 3 hours 30 min.',
      'Medical staff have the authority to remove any runner who appears at risk.',
      'Littering on the course will result in disqualification. Use bins at aid stations.',
      'Prize winners must present valid ID proof and finish within the top 3 of their category.',
    ],
    rewards: [
      { position: '1st Place', prize: '₹50,000 + Trophy + ASICS voucher (₹10,000)' },
      { position: '2nd Place', prize: '₹30,000 + Medal + ASICS voucher (₹5,000)' },
      { position: '3rd Place', prize: '₹15,000 + Medal + Goodie hamper' },
      { position: 'Age Group Winners', prize: 'Medal + Certificate (5-year brackets)' },
      { position: 'All Finishers', prize: 'Premium finisher medal + E-certificate + Race photos' },
    ],
    organizer: {
      name: BRAND.companyName,
      contactEmail: BRAND.supportEmail,
      contactPhone: BRAND.contactPhone,
      website: BRAND.website,
      registeredOffice: `${BRAND.officeAddress.line1}, ${BRAND.officeAddress.line2}`,
    },
  },
  {
    id: 'salem-yercaud-10k',
    title: 'Salem Yercaud Run',
    status: 'Registration Opening Soon',
    date: 'Feb 22, 2027',
    location: 'Yercaud Foothills, Salem',
    venue: 'Yercaud Foothills Start Point, Salem',
    distance: '10K · 5K · 3K Fun Run',
    startTime: '6:30 AM',
    regDeadline: 'Feb 8, 2027',
    image: eventSalem,
    totalSlots: 1500,
    slotsRemaining: 1500,
    price: '₹499 – ₹999',
    description:
      'A scenic run starting from the foothills of Yercaud. The Salem edition offers a unique blend of rural charm and energetic city crowds. The gentle elevation makes it perfect for runners looking for a course with character.',
    route: {
      terrain: 'Gentle incline with downhill finish',
      surface: 'Smooth tarmac with rural stretches',
      elevation: '< 100m total gain',
      certified: 'AFI certified',
      highlights: ['Yercaud Ghat Road', 'Kottai Mariamman Temple', 'Salem Steel Plant bypass', 'Mettur Road', 'Anna Park junction'],
    },
    schedule: [
      { time: '5:00 AM', activity: 'Venue opens — bib collection & baggage drop' },
      { time: '6:00 AM', activity: 'Pre-race warm-up with pace coaches' },
      { time: '6:30 AM', activity: 'Wave 1 — 10K start' },
      { time: '7:00 AM', activity: 'Wave 2 — 5K Sprint start' },
      { time: '7:30 AM', activity: 'Wave 3 — 3K Fun Run start' },
      { time: '8:00 AM – 12:00 PM', activity: 'Finish zone open — medals, refreshments, photo zone' },
      { time: '12:30 PM', activity: 'Prize ceremony — category winners' },
    ],
    raceKit: ['Premium cotton race T-shirt', 'Timing chip integrated bib', 'Goodie bag', 'Event wristband', 'Digital race guide'],
    rules: [
      'Race bib must be worn on the front and remain visible at all times.',
      'Headphones are discouraged — bone conduction only.',
      'No strollers, cycles, or animals on the course.',
      'Start in your assigned wave.',
      'Medical personnel may remove any runner deemed unfit to continue.',
      'Use designated bins at aid stations.',
    ],
    rewards: [
      { position: '1st Place', prize: '₹15,000 + Trophy + Decathlon voucher (₹3,000)' },
      { position: '2nd Place', prize: '₹8,000 + Medal + Decathlon voucher (₹2,000)' },
      { position: '3rd Place', prize: '₹5,000 + Medal + Goodie hamper' },
      { position: 'All Finishers', prize: 'Finisher medal + E-certificate' },
    ],
    organizer: {
      name: BRAND.companyName,
      contactEmail: BRAND.supportEmail,
      contactPhone: BRAND.contactPhone,
      website: BRAND.website,
      registeredOffice: `${BRAND.officeAddress.line1}, ${BRAND.officeAddress.line2}`,
    },
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
    image: eventBengaluru,
    totalSlots: 2000,
    slotsRemaining: 850,
    price: '₹499 – ₹1,499',
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
    raceKit: ['Premium dry-fit race T-shirt', 'Timing chip integrated bib', 'Goodie bag', 'Event wristband', 'Digital race guide'],
    rules: [
      'Race bib must be worn on the front and remain visible at all times.',
      'Headphones with ambient mode only. Stay aware of instructions from marshals.',
      'No strollers, cycles, or animals on the course.',
      'Start in your assigned wave. Cut-off for Half Marathon is 3 hours 30 min.',
      'Medical personnel may remove any runner deemed unfit to continue.',
      'Use designated bins at aid stations. Course littering results in disqualification.',
      'Prize claim requires valid photo ID and on-time finish in top 3.',
    ],
    rewards: [
      { position: '1st Place', prize: '₹25,000 + Trophy + Decathlon voucher (₹5,000)' },
      { position: '2nd Place', prize: '₹15,000 + Medal + Decathlon voucher (₹3,000)' },
      { position: '3rd Place', prize: '₹8,000 + Medal + Goodie hamper' },
      { position: 'All Finishers', prize: 'Finisher medal + E-certificate' },
    ],
    organizer: {
      name: BRAND.companyName,
      contactEmail: BRAND.supportEmail,
      contactPhone: BRAND.contactPhone,
      website: BRAND.website,
      registeredOffice: `${BRAND.officeAddress.line1}, ${BRAND.officeAddress.line2}`,
    },
  },
]

/* ─── Race categories ─────────────────────────────────────────────── */
export const raceCategories = [
  {
    id: 'kids-run',
    title: 'Kids Run',
    distance: '1K',
    detail:
      'A fun, non-competitive dash designed for young runners. Every child gets a medal, a goodie bag, and the thrill of crossing a real finish line.',
    description:
      'A fun, non-competitive dash designed for young runners. Every child gets a medal, a goodie bag, and the thrill of crossing a real finish line.',
    difficulty: 'Beginner',
    audience: 'Children aged 4–12 (parent accompaniment required under 8)',
    avgTime: '10–20 min',
    featured: false,
    price: '₹299',
    medal: true,
    certificate: true,
  },
  {
    id: 'sprint',
    title: '5K',
    distance: '5K',
    detail:
      'Fast-paced and full of crowd energy. The perfect starting point for first-time racers and a great speed challenge for experienced runners.',
    difficulty: 'Easy',
    audience: 'Beginners, casual runners, first-time racers',
    avgTime: '25–50 min',
    featured: false,
    price: '₹799',
    startTime: '7:00 AM',
    medal: true,
    certificate: true,
  },
  {
    id: 'ten-k',
    title: '10K',
    distance: '10K',
    detail:
      'A step up that rewards consistent training. The 10K is the ideal distance for runners looking to push beyond 5K without committing to half-marathon mileage.',
    difficulty: 'Easy–Moderate',
    audience: 'Intermediate runners, 5K graduates',
    avgTime: '50–90 min',
    featured: false,
    price: '₹999',
    startTime: '6:30 AM',
    medal: true,
    certificate: true,
  },
  {
    id: 'half',
    title: 'Half Marathon',
    distance: '21K',
    detail:
      'The sweet spot between endurance and speed. A true measure of distance training and race-day strategy. Half the marathon, twice the thrill.',
    difficulty: 'Moderate',
    audience: 'Experienced runners, 10K graduates',
    avgTime: '1 hr 45 min – 2 hr 30 min',
    featured: false,
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
      'The iconic distance. Every step earned through months of preparation, determination, and dedication. A life goal wrapped in 42.195 kilometres.',
    difficulty: 'Advanced',
    audience: 'Seasoned runners with consistent training (16+ week plan)',
    avgTime: '3 hr 30 min – 6 hr',
    featured: true,
    price: '₹2,499',
    startTime: '5:30 AM',
    medal: true,
    certificate: true,
  },
  {
    id: 'corporate',
    title: 'Corporate Challenge',
    distance: '5K Relay (4 × 1.25K)',
    detail:
      'A team relay for offices and organisations. Build camaraderie, friendly competition, and company pride — all on the race course.',
    difficulty: 'All Levels',
    audience: 'Corporate teams of 4 (mixed gender encouraged)',
    avgTime: '30–60 min per team',
    featured: false,
    price: '₹3,999 per team',
    medal: true,
    certificate: true,
  },
]

/* ─── Gallery ─────────────────────────────────────────────────────── */
export const galleryImages = [
  {
    alt: 'Indian marathon runners crossing the finish line in jubilation at sunrise',
    src: galleryFinishLine,
    large: true,
    caption: 'Finish Line',
  },
  {
    alt: 'Thousands of Indian runners at the starting gun on Marina Beach',
    src: galleryStartLine,
    large: false,
    caption: 'The Start',
  },
  {
    alt: 'Indian runner receiving a finisher medal from a volunteer',
    src: galleryMedalCeremony,
    large: false,
    caption: 'Medal Ceremony',
  },
  {
    alt: 'Cheering crowd lining the Indian city marathon route',
    src: communityCrowdSupport,
    large: false,
    caption: 'Crowd Support',
  },
  {
    alt: 'Indian runners at a hydration station mid-race',
    src: communityHydration,
    large: false,
    caption: 'Hydration Point',
  },
  {
    alt: 'Indian family celebrating together at the marathon finish arch',
    src: galleryFamilyFinish,
    large: false,
    caption: 'Family Moments',
  },
]

/* ─── Community data ─────────────────────────────────────────────── */
export const runningClubs = [
  { name: 'Chennai Runners Club', city: 'Chennai', members: '2,400+', meets: 'Every Sunday 5:30 AM at Marina Beach', description: 'The city\'s largest running community. Group runs, pace training, and marathon prep sessions led by certified coaches.', image: clubChennai },
  { name: 'Salem Striders', city: 'Salem', members: '850+', meets: 'Sat & Wed 6:00 AM at Anna Park', description: 'Growing community of runners in Salem. Weekly long runs on the Yercaud ghat road and track sessions at the stadium.', image: clubSalem },
  { name: 'Bengaluru Pacemakers', city: 'Bengaluru', members: '3,100+', meets: 'Every Saturday 5:30 AM at Cubbon Park', description: 'One of Bengaluru\'s oldest running groups. Interval training, tempo runs, and social runs across the city\'s best routes.', image: clubBengaluru },
]

export const volunteerProgram = {
  description: `Every ${BRAND.name} event is powered by hundreds of volunteers who bring energy, warmth, and reliability to race day. From bib distribution to water stations, finish-line medals to course marshalling — our volunteers are the backbone of every finish line.`,
  roles: [
    'Bib Collection & Check-in — Help runners with QR verification and kit distribution.',
    'Hydration Station Crew — Manage water tables, electrolyte dispensing, and sponge stations.',
    'Course Marshal — Guide runners at turns, cheer zones, and alert medical of any issues.',
    'Finish Line Team — Distribute medals, water, and refreshments to every finisher.',
    'Baggage & Information — Man the baggage counter and answer runner queries.',
    'Photography & Content — Capture race-day moments for the community gallery.',
  ],
  perks: ['Official volunteer T-shirt & cap', 'Meals & refreshments on race day', 'Certificate of appreciation', 'Priority registration for future events', 'Invitation to volunteer appreciation meet'],
}

export const ambassadorProgram = {
  description: `Our ambassadors are the face of ${BRAND.name} in their cities. They lead group runs, share their training journeys, and help build the running community year-round.`,
  benefits: ['Free race entry for one event per season', `Exclusive ${BRAND.name} ambassador kit (gear, apparel)`, 'Feature on our website and social media channels', 'Access to ambassador-only training sessions', 'Networking with elite runners and coaches', 'First access to new event announcements'],
  expectations: ['Lead at least one community run per month', 'Share your training journey on social media (2+ posts/month)', `Represent ${BRAND.name} at local running events`, 'Provide feedback on race experience and improvements'],
}

export const upcomingMeetups = [
  { title: 'Chennai Full Marathon Prep Run', date: 'Dec 21, 2026', time: '5:30 AM', location: 'Marina Beach, Gandhi Statue', type: 'Training Run', description: 'A 32-km long run for full marathon participants. Pace groups from 5:00 to 7:00 min/km. Post-run breakfast included.' },
  { title: 'Salem Hill Challenge', date: 'Jan 10, 2027', time: '6:00 AM', location: 'Yercaud Ghat Road Start', type: 'Community Run', description: 'A challenging 15-km run up the Yercaud ghat road. Open to all fitness levels. Water stations at every 3 km.' },
  { title: 'Bengaluru Night Marathon', date: 'Feb 6, 2027', time: '7:00 PM', location: 'Cubbon Park', type: 'Social Run', description: 'A 10-km night run under the lights of Bengaluru. Music, glow sticks, and a community dinner after the run.' },
  { title: 'Run for a Cause — Charity 5K', date: 'Mar 14, 2027', time: '6:30 AM', location: 'Marina Beach, Chennai', type: 'Charity', description: 'A 5-km fun run supporting local sports education for underprivileged children. All registration fees go to the cause.' },
]

/* ─── Location cards ──────────────────────────────────────────────── */
export const locationCards = [
  {
    city: 'Chennai',
    label: 'Marina Beach · Full 42K · Half 21K',
    date: 'Jan 18, 2027',
    image: locationChennai,
    accentColor: '#F97316',
  },
  {
    city: 'Salem',
    label: 'Yercaud Foothills · 10K · 5K',
    date: 'Feb 22, 2027',
    image: locationSalem,
    accentColor: '#0EA5E9',
  },
  {
    city: 'Bengaluru',
    label: 'Cubbon Park · Half 21K · 5K',
    date: 'Mar 8, 2027',
    image: locationBengaluru,
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
  {
    name: 'Rohan Deshpande',
    city: 'Pune',
    category: 'Full Marathon · 42K',
    quote:
      'Ran my debut full marathon at Chennai Marina. The pace coaches helped me stay on target till km 35. That final stretch along the beach is something I will never forget.',
    rating: 5,
  },
  {
    name: 'Anjali Nair',
    city: 'Kochi',
    category: 'Half Marathon · 21K',
    quote:
      'Drove six hours just for this race and it was worth every kilometre. The route through Cubbon Park at sunrise was breathtaking. The medal is now my most prized possession.',
    rating: 5,
  },
  {
    name: 'Suresh Babu',
    city: 'Salem',
    category: '10K',
    quote:
      'I started running only six months ago. Crossing the 10K finish line in Salem made me feel like I could do anything. The medical support on course gave me so much confidence.',
    rating: 5,
  },
  {
    name: 'Meera Krishnan',
    city: 'Chennai',
    category: '3K Fun Run',
    quote:
      'My seven-year-old ran the 3K with me. The volunteers high-fived her at the finish and she still talks about it months later. Thank you for making it so family-friendly.',
    rating: 5,
  },
  {
    name: 'Vikram Rajan',
    city: 'Bengaluru',
    category: 'Full Marathon · 42K',
    quote:
      `Four marathons with ${BRAND.name} and counting. Every edition gets better — better route, better crowd support, better organisation. The bar keeps rising.`,
    rating: 5,
  },
  {
    name: 'Lakshmi Venkatesh',
    city: 'Coimbatore',
    category: 'Half Marathon · 21K',
    quote:
      'The hydration stations, the medical volunteers, the music at every km marker — every detail showed how much thought went into the runner experience. I am bringing my whole running group next year.',
    rating: 5,
  },
  {
    name: 'Aditya Sharma',
    city: 'Delhi',
    category: '5K Sprint',
    quote:
      'Flew down from Delhi for the Bengaluru edition. The energy at the start line was electric. Finished with a personal best and made friends from three different cities.',
    rating: 5,
  },
]

/* ─── FAQ items ───────────────────────────────────────────────────── */
export const faqItems = [
  /* Registration */
  [
    'What race distances are available?',
    'We offer four distances: 3K Fun Run, 5K Sprint, 21K Half Marathon, and 42K Full Marathon. Each has its own wave start, dedicated route, and finisher medal. All distances are open to runners of every experience level.',
  ],
  [
    'Can I register on the day of the event?',
    'On-spot registration is available only if the event has not reached its participant cap. It typically closes 24 hours before race start. We strongly recommend registering online to guarantee your spot, preferred category, and jersey size.',
  ],
  [
    'Is there an age limit for participation?',
    'Full Marathon (42K): minimum 18 years. Half Marathon (21K): minimum 16 years. 10K and 5K: minimum 12 years (parental consent required below 18). 3K Fun Run: open to all ages — children under 10 must be accompanied by a registered adult.',
  ],

  /* Refunds */
  [
    'What is the cancellation and refund policy?',
    'Cancellations made 30+ days before the event: 75% refund. 14–29 days: 50% refund. Less than 14 days: no refund, but you may transfer your registration to another person up to 10 days before the event. Refunds are processed within 10 working days.',
  ],
  [
    'Can I defer my registration to next year?',
    'Deferral requests made at least 21 days before the event are reviewed on a case-by-case basis. Approved deferrals are valid for one edition of the same event in the following season. A nominal processing fee applies.',
  ],

  /* Bib Collection */
  [
    'How do I collect my race bib?',
    'Bib collection is at the event expo — held the day before (10:00 AM – 7:00 PM) and on race morning (from 4:00 AM). Carry your QR ticket (from your dashboard) and a valid photo ID. You may authorise someone else to collect your bib by sharing a signed consent form and a copy of your ID.',
  ],
  [
    'What is included in my race kit?',
    'Your race kit includes: timing chip integrated bib, premium race T-shirt (in your chosen size), event wristband, goodie bag with partner samples, race-day guide booklet, and temporary tattoo sleeve. Collect your kit at the expo — kits are not mailed.',
  ],

  /* Race Timing */
  [
    'Are timing chips included in registration?',
    'Yes. Every registered participant receives a disposable timing chip attached to their bib. Your official finish time (gun time and chip time) is automatically recorded as you cross the chip mat at the start and finish arches. Live results are available on the event page.',
  ],
  [
    'How are tie-breakers handled in results?',
    'In the event of a tie, the runner with the faster chip time (net time) is ranked higher. If both chip times match, the runner who registered first receives the higher ranking. Age category rankings are computed separately.',
  ],

  /* Certificates */
  [
    'How do I download my finisher certificate?',
    'E-certificates are generated within 48 hours of the event and published on the event page. Log into your participant dashboard, navigate to "My Results", and click "Download Certificate". Certificates include your name, finish time, category, and overall rank.',
  ],
  [
    'Will I receive a physical medal?',
    'Yes — every finisher across all categories receives a premium finisher medal at the finish line. Medal design is unique to each event edition and revealed at the race-day expo. 3K Fun Run participants also receive a participation medal.',
  ],

  /* Parking & Transport */
  [
    'Where should I park on race day?',
    'Dedicated parking areas are arranged at each event venue. Details are published on the event page and sent via email 1 week before race day. We recommend carpooling or using public transport — parking is free but limited. Shuttle services operate from key transit points.',
  ],

  /* Medical Support */
  [
    'What medical support is available on the course?',
    'Medical aid posts with trained paramedics are stationed every 2–3 km. Ambulances follow the last runner. Defibrillators (AEDs) are positioned at key locations. Bike medics patrol the entire course. Kauvery Hospital provides full emergency backup at every event.',
  ],
  [
    'What happens if I feel unwell during the race?',
    'Stop immediately and wave for assistance. Every water station has a medical volunteer. If you see a fellow runner in distress, alert the nearest marshal or medical volunteer. Do not attempt to push through — your health is more important than your finish time.',
  ],

  /* Hydration */
  [
    'How are hydration stations organised?',
    'Water stations are placed every 2 km along the course. Electrolyte drinks (ORS) are available at every alternate station. Sponge stations for cooling are placed at km 8, 18, and 28 (full marathon). For the 3K and 5K, a single hydration station near the midpoint is sufficient.',
  ],
  [
    'Can I carry my own hydration bottle?',
    'Yes — you may carry a personal hydration belt, handheld bottle, or vest. Refill stations with water and electrolyte are available at all main aid stations. Glass bottles are not permitted for safety reasons.',
  ],

  /* Baggage */
  [
    'Is there a baggage storage facility?',
    'Yes. A secure baggage drop area is available at the venue from opening time until 1 hour after the last finisher. Place your gear in the bag provided in your race kit, attach the baggage tag on your bib, and collect it at the finish zone. Valuables should not be left in baggage.',
  ],

  /* Eligibility & Cut-offs */
  [
    'Can I run with headphones or music?',
    'Bone conduction headphones are recommended and permitted. Traditional in-ear headphones are discouraged as they block emergency announcements and marshal instructions. If you wear headphones, keep the volume low and remain aware of your surroundings.',
  ],
  [
    'What are the course cut-off timings?',
    'Full Marathon (42K): 6 hours 30 minutes (12:00 PM). Half Marathon (21K): 3 hours 30 minutes. 10K: 1 hour 45 minutes. 5K Sprint: 60 minutes. Fun Run (3K): 45 minutes. Sweep vehicles follow the last runner at cut-off pace. Participants unable to maintain the pace will be picked up and transported to the finish.',
  ],

  /* Volunteers */
  [
    `How can I volunteer at a ${BRAND.name} event?`,
    'Volunteer registration opens 6 weeks before each event. Sign up through the event page or contact us directly. Roles include bib collection, water stations, course marshalling, finish line support, and photography. Volunteers receive an official T-shirt, meals, and a certificate of appreciation.',
  ],

  /* Weather */
  [
    'What happens if it rains on race day?',
    'The event proceeds in light to moderate rain. In case of thunderstorms, cyclonic warnings, or extreme weather, the Race Director may delay, modify, or cancel the event for participant safety. Registered participants will be notified via SMS and email. No refunds for weather-related cancellations — credit toward a future event is provided.',
  ],

  /* Photos */
  [
    'Will race photographs be available?',
    'Yes — official event photographers capture runners at the start, along the course, and at the finish line. Photos are typically published within 3–5 days in the event gallery. You can search by bib number. Select photos are also shared on our Instagram and Facebook pages.',
  ],

  /* Results */
  [
    'Where can I find my race results?',
    'Live results are available on the event page during the race. Final results (with splits and age-category rankings) are published within 24 hours. You can search by name, bib number, or city. Results are also synced to your participant dashboard for future reference.',
  ],
  [
    'Are age category awards separate from overall awards?',
    'Yes. Overall winners (top 3 male and female) are not eligible for age category awards. Age categories are in 5-year brackets (18–24, 25–29, 30–34, etc.), and the top 3 in each bracket receive a medal and certificate. This ensures fair recognition across all age groups.',
  ],
]

/* ─── Sponsors ────────────────────────────────────────────────────── */
export const sponsors = [
  {
    category: 'Title Sponsor',
    name: 'Kauvery Hospital',
    description:
      'India\'s leading multi-specialty hospital chain and our proud title partner. Kauvery Hospital provides on-course medical support at every event.',
  },
  {
    category: 'Hydration Partner',
    name: '100XE Energy',
    description: 'Official hydration partner providing electrolyte drinks and water stations across all race routes.',
  },
  {
    category: 'Medical Partner',
    name: 'Apollo Hospitals',
    description: 'Multi-specialty medical team managing aid posts, bike medics, and emergency response on race day.',
  },
  {
    category: 'Fitness Partner',
    name: 'Fitbit India',
    description: 'Official fitness tracking partner. Every participant receives a digital training plan and race-day tracking guide.',
  },
  {
    category: 'Technology Partner',
    name: 'Decathlon Sports',
    description: 'Official sporting goods partner providing timing infrastructure and RFID chip integration.',
  },
]

/* ─── Stats data ──────────────────────────────────────────────────── */
export const statsData = [
  { label: 'Participants', endValue: 25000, suffix: '+', icon: 'users' },
  { label: 'Cities', endValue: 3, suffix: '', icon: 'city' },
  { label: 'Years Running', endValue: 12, suffix: '+', icon: 'calendar' },
  { label: 'Volunteers', endValue: 1500, suffix: '+', icon: 'hands' },
  { label: 'Finishers', endValue: 22000, suffix: '+', icon: 'runner' },
  { label: 'Partner Brands', endValue: 50, suffix: '+', icon: 'handshake' },
]

/* ─── Newsletter / CTA ────────────────────────────────────────────── */
export const newsletterData = {
  heading: 'STAY IN THE LOOP.',
  subheading: 'Race announcements, training tips, and community stories — delivered to your inbox.',
  placeholder: 'Enter your email address',
  buttonText: 'Subscribe',
  successMessage: `You're on the list. Welcome to the ${BRAND.name} community.`,
}

export const ctaData = {
  heading: 'YOUR START LINE AWAITS.',
  subheading: 'Every champion was once a beginner who decided to start. Register today and take the first step towards your finish line.',
  buttonText: 'Register Now',
}

/* ─── Static page content ──────────────────────────────────────────────── */
export const pageContent = {
  about: {
    eyebrow: 'Our Story',
    title: 'Built for those who push further.',
    description: `${BRAND.name} was born from one belief: endurance events should be as extraordinary as the athletes who run them. We design every race — from the start gun to the finish arch — to deliver moments worth every mile.`,
    story: [
      'It started with a conversation between a group of runners who felt that the events they loved were being run like logistics exercises — efficient, yes, but missing something essential. They wanted races that felt worthy of the training they put in.',
      `${BRAND.name} launched in 2024 with a single event in Chennai. 800 runners. A borrowed timing system. A finish arch held up by determination. Since then, we've grown to twelve events across six Indian cities, and every one of them has kept the same promise: run a race that means something.`,
      'Today we work with a dedicated team of event professionals, pace coaches, route designers, and logistics coordinators who believe that race day should be the best day of a runner\'s year. Our events are built on three pillars — operational precision, runner-first design, and inclusive community.',
    ],
    mission: {
      heading: 'Our Mission',
      text: 'To create endurance events that are as extraordinary as the athletes who run them. We believe every start line should inspire confidence, every route should tell a story, and every finish arch should feel like an achievement worth celebrating. We measure our success not just by the number of participants, but by the number of runners who cross the finish line smiling.',
    },
    vision: {
      heading: 'Our Vision',
      text: 'A India where every city has a marathon worth running. Where running is not just a sport but a community movement — bringing together people from all walks of life on a common starting line. We envision a network of world-class, city-owned endurance events that showcase the character of each location while maintaining the highest standards of runner safety, operational excellence, and environmental responsibility.',
    },
    whyParticipate: [
      { title: 'World-Class Organisation', detail: 'Precision wave starts, RFID chip timing, live results, and medical coverage at every kilometre. You focus on the run — we handle everything else.' },
      { title: 'Routes with Character', detail: 'Every course is handpicked and mapped for drama, landmarks, and crowd support. From coastal roads to heritage boulevards — every kilometre has a story.' },
      { title: 'Inclusive by Design', detail: 'Whether you are chasing a podium finish or crossing your first finish line, you belong. Separate waves, pacing groups, and support for runners of all abilities.' },
      { title: 'Community That Stays', detail: `Join running clubs, training groups, and social runs in your city. ${BRAND.name} is not just race day — it is a year-round community of runners who share the road.` },
    ],
    safety: {
      heading: 'Safety Standards',
      items: [
        'Medical aid posts every 2–3 km staffed by trained paramedics',
        'Defibrillators (AEDs) positioned at critical points on the course',
        'Ambulance support following the last runner',
        'Bike medics patrolling the entire route',
        'Course marshals at every junction and turn',
        'Weather monitoring and emergency action protocols',
        'Mandatory emergency contact collection during registration',
        'Hydration stations every 2 km with water and electrolyte drinks',
        'Baggage security and finisher transport assistance',
      ],
    },
    communityImpact: {
      heading: 'Community Impact',
      text: `Beyond race day, ${BRAND.name} invests in local running ecosystems. We sponsor school running programmes, support grassroots athletics, and organise free community runs in every city we operate. Our events generate economic activity for local businesses — from hotels and restaurants to transport and retail. Every event partners with a local charity, channelling a portion of registration fees toward community development initiatives.`,
    },
    pillars: [
      { title: 'Precision at scale', detail: 'Wave starts, timing chips, QR check-in, medical coverage — every operational detail is designed to hold under the pressure of thousands of runners on the same road.' },
      { title: 'Routes worth running', detail: 'Every city edition is mapped for drama, character, and crowd support. We scout locations for months before committing to a route.' },
      { title: 'Community over competition', detail: 'Our races welcome first-timers and elite runners on the same start line. The finish arch belongs to everyone who crosses it.' },
    ],
    team: [
      { name: 'Anand Raghunathan',  role: 'Co-Founder & Race Director',  note: 'Former national-level marathon runner with 15+ years of event management experience. Has directed over 50 endurance events across India.' },
      { name: 'Deepa Krishnaswamy', role: 'Co-Founder & Head of Operations', note: 'Logistics specialist who has directed large-scale public events across South India. Former operations lead for Chennai Marathon series.' },
      { name: 'Vikram Seshadri',    role: 'Head of Technology',          note: 'Built the registration and timing infrastructure from the ground up. 12 years of experience in sports technology platforms.' },
      { name: 'Dr. Priya Srinivasan', role: 'Medical Director',         note: `Senior sports medicine physician with a focus on endurance event medical planning. Leads the medical team across all ${BRAND.name} events.` },
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
    title: "Let's build the next start line.",
    description:
      'For event collaboration, participant support, partnership opportunities, and media enquiries — our team is here.',
    supportTimings: 'Monday to Saturday, 10:00 AM – 7:00 PM IST',
    email: BRAND.supportEmail,
    phone: BRAND.contactPhone,
    office: {
      line1: BRAND.officeAddress.line1,
      line2: BRAND.officeAddress.line2,
    },
    social: [
      { platform: 'Instagram', url: BRAND.social.instagram.url, handle: BRAND.social.instagram.handle },
      { platform: 'X / Twitter', url: BRAND.social.twitter.url, handle: BRAND.social.twitter.handle },
      { platform: 'Facebook', url: BRAND.social.facebook.url, handle: BRAND.social.facebook.handle },
      { platform: 'YouTube', url: BRAND.social.youtube.url, handle: BRAND.social.youtube.handle },
      { platform: 'LinkedIn', url: BRAND.social.linkedin.url, handle: BRAND.social.linkedin.handle },
    ],
  },
  community: {
    eyebrow: 'Our Community',
    title: 'On the move, together.',
    description: `${BRAND.name} is more than race day — it is a year-round community of runners, volunteers, and ambassadors who share the road across India.`,
  },
}
