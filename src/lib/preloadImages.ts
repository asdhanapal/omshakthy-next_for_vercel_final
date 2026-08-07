/**
 * Background media preloader.
 *
 * Used by IntroSection: once the intro video is actually playing, the
 * remaining ~10s of runway is used to warm the browser cache for the
 * heaviest below-the-fold images (hero slider, property grid, financial
 * partner logos) so they don't compete with the video for bandwidth/decode
 * time and don't stutter in when the intro swipes away.
 *
 * All requests fire in parallel — the browser's own connection pool and
 * priority scheduling handles contention with the video far better than an
 * artificial one-at-a-time queue would.
 */
export function preloadImages(urls: string[]) {
  if (typeof window === 'undefined') return

  urls.forEach((url) => {
    const img = new window.Image()
    img.decoding = 'async'
    img.src = url
  })
}

// The heaviest below-the-fold assets the user hits right after the intro:
// hero slideshow first, then the property grid (both visible within the
// first couple of scrolls on Home).
export const HERO_PRELOAD_IMAGES = [
  '/hero-new-3.png',
  '/hero-slide-9.png',
  '/hero-slide-3.png',
  '/hero-slide-1.png',
  '/hero-slide-8.png',
  '/hero-slide-2.png',
  '/hero-new-2.png',
]

export const PROPERTY_PRELOAD_IMAGES = [
  '/canopus-magha.png',
  '/regalia.png',
  '/elite-grand.png',
  '/mathura.png',
  '/property-5.png',
  '/property-6.png',
]

// Financial Partners logo strip (TrustedPartnersSection) — small files, but
// warming them here means they're already cached by the time the user
// scrolls that far down the page.
export const PARTNER_PRELOAD_IMAGES = [
  '/partners/hdfc.png',
  '/partners/icici.png',
  '/partners/axis.png',
  '/partners/kotak.png',
  '/partners/idfc-first.png',
  '/partners/bajaj-finserv.png',
]
