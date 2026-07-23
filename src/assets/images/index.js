/* ─────────────────────────────────────────────────────────────────────────
 * Image manifest — import all local assets here so Vite processes them
 * correctly (hashed filenames, optimised bundles). Always import from this
 * file instead of using raw URL strings.
 * ───────────────────────────────────────────────────────────────────────── */

/* ── Hero ────────────────────────────────────────────────────────────── */
import heroMarathonStart from './hero/marathon-start.webp'

/* ── About ───────────────────────────────────────────────────────────── */
import aboutRunner from './about/about.webp'

/* ── Events ──────────────────────────────────────────────────────────── */
import eventChennai    from './events/chennai-marina.webp'
import eventSalem      from './events/salem-yercaud.webp'
import eventBengaluru  from './events/bengaluru-cubbon park.webp'

/* ── Locations ───────────────────────────────────────────────────────── */
import locationChennai   from './locations/chennai.webp'
import locationSalem     from './locations/salem.webp'
import locationBengaluru from './locations/bengaluru.webp'

/* ── Gallery ─────────────────────────────────────────────────────────── */
import galleryFinishLine    from './gallery/finish-line.webp'
import galleryStartLine     from './gallery/start-line.webp'
import galleryWarmUp        from './gallery/warm-up.webp'
import galleryMedalCeremony from './gallery/medal-ceremony.webp'
import galleryFamilyFinish  from './gallery/family-finish.webp'

/* ── Community ───────────────────────────────────────────────────────── */
import communityRunning        from './community/running.webp'
import communityHydration      from './community/hydration.webp'
import communityMedal          from './community/medal.webp'
import communityCrowdSupport   from './community/crowd-support.webp'
import clubChennai             from './community/running-club-chennai.webp'
import clubSalem               from './community/running-club-salem.webp'
import clubBengaluru           from './community/running-club-bengaluru.webp'

/* ── CTA ─────────────────────────────────────────────────────────────── */
import ctaFinishCelebration from './cta/finish celebration.webp'

export {
  /* Hero */
  heroMarathonStart,

  /* About */
  aboutRunner,

  /* Events */
  eventChennai,
  eventSalem,
  eventBengaluru,

  /* Locations */
  locationChennai,
  locationSalem,
  locationBengaluru,

  /* Gallery */
  galleryFinishLine,
  galleryStartLine,
  galleryWarmUp,
  galleryMedalCeremony,
  galleryFamilyFinish,

  /* Community */
  communityRunning,
  communityHydration,
  communityMedal,
  communityCrowdSupport,
  clubChennai,
  clubSalem,
  clubBengaluru,

  /* CTA */
  ctaFinishCelebration,
}
