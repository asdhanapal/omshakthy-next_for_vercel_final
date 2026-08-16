'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import './TrustedPartnersSection.css'

/* ============================================================
   TrustedPartnersSection
   Combines two sections onto one ivory-background page:
   1. "Trusted Developers in Chennai" — aerial hero + 5 service pillars
      (rebuilt to match the reference mockup — see git history for the
      earlier video-band version this replaced)
   2. "Financial Partners" — bank/partner logo strip
   ============================================================ */

/* Small stroke icons for the pillar badges — same inline-SVG, currentColor
   convention as LeadersSection's ported icon set. */
const pillarIcons = {
  grid: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 8h1.5M13.5 8H15M9 12h1.5M13.5 12H15M9 16h1.5M13.5 16H15" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 18c3-1.4 13-1.4 16 0" />
      <path d="M12 18a6 6 0 0 0 6-6c0-3-2-5-6-5s-6 2-6 5a6 6 0 0 0 6 6Z" />
      <path d="M11 5V3.5h2V5" />
    </svg>
  ),
  tower: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M7 21V7l5-4 5 4v14" />
      <path d="M10 21v-5h4v5M9 10h1.5M13.5 10H15M9 14h1.5M13.5 14H15" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  ),
}

const pillars = [
  {
    title: 'Land Aggregation',
    desc: 'Immense knowledge of land and its value, sound research and extended expertise in the realms of real estate properties.',
    img: '/trusted-partners/land-aggregation.jpg',
    icon: pillarIcons.grid,
  },
  {
    title: 'Residential Development',
    desc: 'Utmost care in revitalization efforts to improve community life across all residential projects that are undertaken.',
    img: '/trusted-partners/residential-development.jpg',
    icon: pillarIcons.building,
  },
  {
    title: 'Hospitality Management',
    desc: 'Qualified and well trained individuals that provide quick and relevant solutions for all forms of support services.',
    img: '/trusted-partners/hospitality-management.jpg',
    icon: pillarIcons.bell,
  },
  {
    title: 'Commercial Projects',
    desc: 'Complete transparency in price, regulations, schedule and documentation allows for smooth execution of commercial projects.',
    img: '/trusted-partners/commercial-projects.jpg',
    icon: pillarIcons.tower,
  },
  {
    title: 'Supply Chain Management',
    desc: 'Complete transparency in price, regulations, schedule and documentation allows for smooth execution of commercial projects.',
    img: '/trusted-partners/supply-chain.jpg',
    icon: pillarIcons.truck,
  },
]

/* Callouts on the aerial hero — left offset (% of image width) + how far
   the leader-line drops before the label sits. Outer two (LAND/COMMERCE)
   drop further, matching the reference's slightly bowed line lengths. */
const heroLabels = [
  { text: 'LAND', left: '9%', drop: 150 },
  { text: 'LIVING', left: '34%', drop: 108 },
  { text: 'EXPERIENCE', left: '60%', drop: 118 },
  { text: 'COMMERCE', left: '85%', drop: 155 },
]

const partnerLogos = [
  { name: 'HDFC Bank', file: '/partners/hdfc.png' },
  { name: 'ICICI Bank', file: '/partners/icici.png' },
  { name: 'Axis Bank', file: '/partners/axis.png' },
  { name: 'Kotak Mahindra Bank', file: '/partners/kotak.png' },
  { name: 'IDFC FIRST Bank', file: '/partners/idfc-first.png' },
  { name: 'Bajaj Finserv', file: '/partners/bajaj-finserv.png' },
]

const EASE = [0.16, 1, 0.3, 1] as const

type Pillar = (typeof pillars)[number]

/* Own component so each card can carry its own stagger delay cleanly. */
function TPPillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  return (
    <motion.a
      href="#"
      className="tp__pillar"
      initial={{ opacity: 0, y: 36 }}
      /* whileInView, not a shared `built` boolean threaded down from a
         mount timer — that timer fired ~150ms after the PAGE loaded, not
         when this section actually scrolled into view, so on a real
         (long, scroll-jacked-hero-first) visit the whole sequence had
         already finished off-screen by the time anyone actually saw it.
         whileInView uses a real IntersectionObserver per element, so it
         genuinely fires when scrolled into view, whenever that happens.
         amount:0 (trigger the instant any pixel is visible) + a short
         duration/stagger — this section sits in the free-scroll zone
         after PageController releases, with nothing pinning the viewport
         in place while it animates, so a late trigger + long sequence
         meant a normal scroll gesture could carry the whole compact
         section past the viewport before the animation finished. */
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.08 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tp__pillar-bg" src={pillar.img} alt="" aria-hidden loading="lazy" />
      <span className="tp__pillar-scrim" aria-hidden />
      <span className="tp__pillar-num">{String(index + 1).padStart(2, '0')}</span>
      <span className="tp__pillar-icon">{pillar.icon}</span>
      <h3 className="tp__pillar-title">{pillar.title}</h3>
      <p className="tp__pillar-desc">{pillar.desc}</p>
      <span className="tp__pillar-explore">Explore →</span>
    </motion.a>
  )
}

const TrustedPartnersSection = () => {
  const pillarsRef = useRef<HTMLDivElement>(null)

  const scrollToPillars = () => {
    pillarsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section className="tp" aria-label="Trusted developers and financial partners" data-header-theme="light">
      <div className="tp__inner">
        {/* Waves background */}
        <div className="tp__waves" aria-hidden>
          <div className="tp__wave tp__wave--1">
            <svg viewBox="0 0 2880 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,600 C240,540 480,660 720,600 C960,540 1200,660 1440,600 C1680,540 1920,660 2160,600 C2400,540 2640,660 2880,600 L2880,900 L0,900 Z" fill="rgba(2,95,138,0.07)" />
              <path d="M0,650 C240,610 480,690 720,650 C960,610 1200,690 1440,650 C1680,610 1920,690 2160,650 C2400,610 2640,690 2880,650 L2880,900 L0,900 Z" fill="rgba(2,95,138,0.045)" />
            </svg>
          </div>
          <div className="tp__wave tp__wave--2">
            <svg viewBox="0 0 2880 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,500 C240,440 480,560 720,500 C960,440 1200,560 1440,500 C1680,440 1920,560 2160,500 C2400,440 2640,560 2880,500 L2880,900 L0,900 Z" fill="rgba(2,95,138,0.05)" />
              <path d="M0,560 C240,510 480,610 720,560 C960,510 1200,610 1440,560 C1680,510 1920,610 2160,560 C2400,510 2640,610 2880,560 L2880,900 L0,900 Z" fill="rgba(2,95,138,0.035)" />
            </svg>
          </div>
          <div className="tp__wave tp__wave--3">
            <svg viewBox="0 0 2880 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,700 C240,660 480,740 720,700 C960,660 1200,740 1440,700 C1680,660 1920,740 2160,700 C2400,660 2640,740 2880,700 L2880,900 L0,900 Z" fill="rgba(201,162,39,0.06)" />
              <path d="M0,740 C240,710 480,770 720,740 C960,710 1200,770 1440,740 C1680,710 1920,770 2160,740 C2400,710 2640,770 2880,740 L2880,900 L0,900 Z" fill="rgba(201,162,39,0.04)" />
            </svg>
          </div>
        </div>
        {/* ── Trusted Developers in Chennai ── */}
        <div className="tp__top">
          <div className="tp__hero">
            <span className="tp__side-credit" aria-hidden>
              OmShakthy Agencies (Madras) Private Limited
            </span>
            <div className="tp__hero-left">
              <Link href="/" className="tp__brand-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/omshakthy-logo.png" alt="OmShakthy Homes" />
              </Link>

              {/* Eyebrow sits above the heading visually, but the HEADING
                  is what rolls in first (delay 0) — the eyebrow/intro
                  below are a staggered second pass of the same roll
                  (delay 0.12/0.16), which of the two elements happens to be
                  drawn higher on screen doesn't matter, only the delay
                  value controls animation order. Kept short (whole sequence
                  under ~1s) on purpose — this plays during free, unpinned
                  native scroll (see whileInView note below), so a long
                  sequence risks the viewport scrolling past this compact
                  section before it finishes. */}
              <motion.span
                className="tp__eyebrow"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
              >
                Since 1991
                <span className="tp__eyebrow-line" />
              </motion.span>

              <motion.h2
                className="tp__title"
                initial={{ opacity: 0, x: -70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                Trusted
                <br />
                Developers
                <br />
                <em>in Chennai.</em>
              </motion.h2>

              <span className="tp__title-rule" aria-hidden />

              <motion.p
                className="tp__intro"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.16 }}
              >
                From land to legacy, we create spaces that inspire, empower and endure.
              </motion.p>

              <button type="button" className="tp__scroll-cue" onClick={scrollToPillars}>
                <span className="tp__scroll-cue-icon" aria-hidden>
                  <svg viewBox="0 0 24 24"><path d="M12 4v14M6 13l6 6 6-6" /></svg>
                </span>
                Scroll to Explore
              </button>
            </div>

            <div className="tp__hero-right">
              <span className="tp__hero-tagline">Building Landmarks. Creating Legacies.</span>

              {/* Two real phases, not one blended zoom: scaleY expands the
                  flat line to full height first, and only once that's done
                  does x start translating in from a more-centered offset
                  into its actual slot (delay = scaleY's own duration, so it
                  starts right as expansion ends). */}
              <motion.div
                className="tp__hero-image"
                initial={{ scaleY: 0.025, x: '-16%', opacity: 0 }}
                whileInView={{ scaleY: 1, x: '0%', opacity: 1 }}
                viewport={{ once: true, amount: 0 }}
                transition={{
                  opacity: { duration: 0.2 },
                  scaleY: { duration: 0.45, ease: EASE, delay: 0.05 },
                  x: { duration: 0.35, ease: EASE, delay: 0.5 },
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/trusted-partners/hero-aerial.jpg" alt="Aerial view of an OmShakthy master-planned development, from raw land through residential blocks to commercial towers" />
                <span className="tp__hero-pin" aria-hidden />
                {heroLabels.map((l) => (
                  <span key={l.text} className="tp__hero-label" style={{ left: l.left }}>
                    <span className="tp__hero-label-text">{l.text}</span>
                    <span className="tp__hero-label-line" style={{ height: l.drop }} />
                    <span className="tp__hero-label-dot" />
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="tp__timeline" aria-hidden>
            <span className="tp__timeline-track" />
            {pillars.map((p) => (
              <span key={p.title} className="tp__timeline-dot" />
            ))}
          </div>

          <div className="tp__pillars" ref={pillarsRef}>
            {pillars.map((p, i) => (
              <TPPillarCard key={p.title} pillar={p} index={i} />
            ))}
          </div>
        </div>

        {/* ── Financial Partners ── */}
        <div className="tp__bottom">
          <span className="tp__partners-label">Financial Partners</span>
          <motion.h3
            className="tp__partners-title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Trusted by India&rsquo;s <em>Leading Financial Institutions.</em>
          </motion.h3>
          <div className="tp__logos">
            {partnerLogos.map((p, i) => (
              <motion.div
                className="tp__logo"
                key={p.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.75, ease: EASE, delay: i * 0.11 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.file} alt={p.name} loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustedPartnersSection
