/**
 * BRAND CONFIGURATION — Single source of truth for all brand identity.
 * ────────────────────────────────────────────────────────────────────────
 * To rebrand the entire site, edit ONLY this file.
 * No brand name is hardcoded in any component or page.
 * Every string that appears in the UI is derived from these values.
 * ────────────────────────────────────────────────────────────────────────
 */
export const BRAND = {
  /** Full display name — shown in hero, navbar wordmark, page titles */
  name: 'STRIDEFORGE',

  /** Short abbreviation used in the SVG logo mark */
  shortName: 'SF',

  /** Registered company name */
  companyName: 'STRIDEFORGE Events Pvt. Ltd.',

  /** Primary tagline shown in the hero, loader, and footer */
  tagline: 'Forged in Motion',

  /** One-sentence description used in the footer and meta tags */
  description:
    'A premium endurance event series built for runners, teams, and communities who push every limit.',

  /** Website URL */
  website: 'https://strideforge.in',

  /** Support / contact email */
  supportEmail: 'hello@strideforge.in',

  /** Contact phone number */
  contactPhone: '+91 80000 00000',

  /** Registered office address */
  officeAddress: {
    line1: 'No. 42, Mount Road, Chennai — 600002',
    line2: 'Tamil Nadu, India',
  },

  /** Logo image alt attribute */
  logoAlt: 'Brand logo',

  /** Prefix for runner registration IDs  e.g. "SFR-2026-01234" */
  idPrefix: 'SFR',

  /** Social media links */
  social: {
    instagram: { url: 'https://instagram.com/strideforge', handle: '@strideforge' },
    twitter:   { url: 'https://twitter.com/strideforge',   handle: '@strideforge' },
    facebook:  { url: 'https://facebook.com/strideforge',  handle: 'STRIDEFORGE' },
    youtube:   { url: 'https://youtube.com/@strideforge',  handle: 'STRIDEFORGE Events' },
    linkedin:  { url: 'https://linkedin.com/company/strideforge', handle: 'STRIDEFORGE Events' },
  },

  /** Copyright year shown in the footer */
  year: 2026,

  /**
   * Cities where events are held.
   * Used in the footer and meta descriptions.
   */
  cities: ['Chennai', 'Salem', 'Bengaluru'],
}
