# STRIDEFORGE Events

A production-ready marathon events platform built with React, Vite, and Tailwind CSS.  
Browse events, register with a multi-step form, explore race categories, and connect with the running community.

## Features

- **Event Discovery** — Browse upcoming marathon events with live slot availability and status indicators
- **Multi-Step Registration** — Guided registration flow with event selection, category picker, personal details, emergency contact, jersey preferences, payment method, and confirmation
- **Race Categories** — Detailed view of all race distances from Kids Run to Full Marathon with difficulty, pricing, and audience info
- **Interactive Hero** — Animated countdown timer, scroll-triggered GSAP animations, and edge-swipe navigation on mobile
- **Community Hub** — Running clubs, volunteer & ambassador programs, community meetups, and photo galleries
- **FAQ & Contact** — Expandable FAQ accordion, contact form, social links, and WhatsApp floating button
- **Venue Details** — City-specific venue info with route highlights, parking, public transport, hotels, and medical support
- **SEO Optimized** — Per-page meta tags, Open Graph / Twitter Card support, canonical URLs
- **Responsive Design** — Mobile-first fully responsive layout using Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Bundler | Vite 7 |
| Styling | Tailwind CSS 4 |
| Animation | GSAP 3 + ScrollTrigger |
| Routing | React Router 7 |
| SEO | react-helmet-async |
| Icons | react-icons (Font Awesome 6) |
| QR | qrcode.react |
| Lint | ESLint 9 |

## Installation

```bash
git clone <repo-url>
cd marathon-fe
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Build

```bash
npm run build
npm run preview
```

## Folder Structure

```
marathon-fe/
├── public/
├── src/
│   ├── assets/images/      # Static images (logos, locations, gallery)
│   ├── components/
│   │   ├── common/          # Reusable UI (Button, SEO, Loader, ScrollReveal, etc.)
│   │   ├── layout/          # Navbar, Footer
│   │   └── sections/        # Page sections (Hero, About, FAQ, etc.)
│   ├── config/              # Brand identity (single source of truth)
│   ├── data/                # Static content (events, categories, sponsors, FAQ, etc.)
│   ├── hooks/               # Custom React hooks (useEdgeSwipe)
│   ├── pages/               # Route-level components (Home, Events, Registration, etc.)
│   ├── services/            # API / service integrations
│   ├── styles/              # Global CSS, Tailwind layers, animations
│   ├── utils/               # Helper functions
│   ├── App.jsx              # App shell with routing and loading screen
│   └── main.jsx             # Entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Live Demo

[https://strideforge.in](https://strideforge.in)

## Screenshots

_Coming soon._

## Project Highlights

- **Single source of truth** for brand identity — edit `src/config/brand.js` to rebrand the entire site
- **Zero hardcoded brand strings** in any component
- **Production-ready UX** — page loader, smooth transitions, scroll-triggered reveals, mobile gesture handling
- **Dark theme** with a cohesive orange-amber colour palette (`ember`, `volt`, `obsidian`, `carbon`)

## Performance Optimizations

- Lazy-loaded route components with React.lazy and Suspense
- `fetchPriority="high"` on hero images for improved LCP
- `loading="lazy"` on below-fold images
- GSAP animations with ScrollTrigger `once: true` to avoid repeated work
- CSS `overflow-x: hidden` and `will-change` hints
- Filter isolated to wrapper elements (no direct iframe filter)
- Countdown timer memoized with `useMemo`
- Debounced/responsive hooks

## Accessibility Features

- Semantic landmarks (`<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`)
- `aria-label`, `aria-hidden`, `aria-invalid`, `aria-describedby` throughout
- `role="alert"` on validation errors
- Skip-link ready and focus-visible outlines
- Colour contrast ratios maintained for the dark theme
- Alt text on all images

## Future Improvements

- Server-side rendering (SSR) for improved SEO and first-load performance
- i18n / multi-language support
- PWA with offline support and push notifications
- Real-time registration with backend API integration
- Dark/light theme toggle
- E2E test suite (Playwright or Cypress)

## License

MIT
