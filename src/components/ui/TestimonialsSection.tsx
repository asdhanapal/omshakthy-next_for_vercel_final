'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import './TestimonialsSection.css'

interface Review {
  quote: string
  name: string
  detail: string
  photo: string
  rating: number
  // Alternates the card with a video-thumbnail layout (poster + play button)
  // instead of the written quote. `photo` doubles as the poster image since
  // there's no actual video file per customer yet — see `video` field below.
  video?: boolean
  videoDuration?: string
}

// Content sourced from the Figma "Customer Stories" section.
// NOTE: `photo` images in /public/testimonials are royalty-free placeholders
// (randomuser.me). Swap them for real customer / licensed Indian portraits.
// `video: true` entries render a video-testimonial card (see DeckCard) —
// no real video files exist yet, so the poster/play button is a styled
// affordance only; wire `videoSrc` up once actual clips are shot/uploaded.
const reviews: Review[] = [
  {
    quote:
      'Owning a flat in Santha Towers is a symbol of security for my retired life. The team was transparent, on-time and truly cared.',
    name: 'Jalaja Madanmohan',
    detail: 'B103 – OmShakthy Santha Towers',
    photo: '/testimonials/jalaja.png',
    rating: 5,
  },
  {
    quote:
      "They went above and beyond — providing reticulated gas at no extra cost even though it wasn't part of the original agreement. That's OmShakthy.",
    name: 'D. Dhanasekaran',
    detail: 'OmShakthy Santha Towers',
    photo: '/testimonials/dhanasekaran.png',
    rating: 5,
    video: true,
    videoDuration: '0:48',
  },
  {
    quote:
      'We invested in Regalia at launch price. In 18 months, the land value has appreciated by over 22%. Best investment of my life.',
    name: 'Suresh Rajan',
    detail: 'OmShakthy Regalia, Avadi',
    photo: '/testimonials/suresh.png',
    rating: 5,
  },
  {
    quote:
      'The construction quality is exceptional. Every detail shows their commitment to excellence and customer satisfaction.',
    name: 'Priya Sharma',
    detail: 'OmShakthy Heights',
    photo: '/testimonials/priya.png',
    rating: 5,
    video: true,
    videoDuration: '1:05',
  },
  {
    quote:
      'Great location, amazing amenities, and the after-sales service is outstanding. I recommend OmShakthy to all my friends.',
    name: 'Rajesh Kumar',
    detail: 'OmShakthy Crown',
    photo: '/testimonials/rajesh.png',
    rating: 5,
  },
  {
    quote:
      'The best real estate investment I could have made. OmShakthy delivered exactly what they promised.',
    name: 'Anitha Patel',
    detail: 'OmShakthy Residency',
    photo: '/testimonials/anitha.jpg',
    rating: 5,
    video: true,
    videoDuration: '0:36',
  },
  {
    quote:
      'Getting the keys to our first home together was one of the happiest days of our lives. OmShakthy made the entire journey smooth, transparent and stress-free.',
    name: 'Vikram & Meera Iyer',
    detail: 'OmShakthy Meadows, Guduvancheri',
    photo: '/testimonials/vikram-meera.jpg',
    rating: 5,
    video: true,
    videoDuration: '0:52',
  },
]

const Stars = ({ n }: { n: number }) => (
  <span className="tw-stars" aria-label={`${n} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < n ? 'is-on' : ''} aria-hidden>
        ★
      </span>
    ))}
  </span>
)

// Odometer digit reel — each digit spins through 0-9 and lands on its value.
const ROLLS = 2 // full 0-9 cycles before settling
const CELL = 1.7 // reel cell height in em (tall enough that big serif/italic
// glyphs sit fully inside the window with margin above & below)

const DigitReel = ({
  digit,
  play,
  delay,
}: {
  digit: number
  play: boolean
  delay: number
}) => {
  // sequence: ROLLS full cycles of 0-9, then 0..digit so it lands on `digit`
  const seq: number[] = []
  for (let r = 0; r < ROLLS; r++) for (let i = 0; i < 10; i++) seq.push(i)
  for (let i = 0; i <= digit; i++) seq.push(i)
  const landIndex = seq.length - 1

  return (
    <span className="reel" aria-hidden>
      <motion.span
        className="reel__col"
        initial={{ y: 0 }}
        animate={{ y: play ? `-${landIndex * CELL}em` : 0 }}
        transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {seq.map((n, i) => (
          <span className="reel__digit" key={i}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

// Renders a formatted value (e.g. "20,000", "4.9") as reels for digits and
// static glyphs for separators. Optional trailing suffix (e.g. "+").
const Odometer = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const play = inView

  let digitCount = 0
  return (
    <span className="odo" ref={ref} aria-label={value + suffix}>
      {value.split('').map((ch, i) => {
        if (ch >= '0' && ch <= '9') {
          const delay = digitCount * 0.12
          digitCount += 1
          if (reduce) {
            return (
              <span className="reel" key={i} aria-hidden>
                <span className="reel__digit">{ch}</span>
              </span>
            )
          }
          return <DigitReel key={i} digit={Number(ch)} play={play} delay={delay} />
        }
        return (
          <span className="odo__sep" key={i} aria-hidden>
            {ch}
          </span>
        )
      })}
      {suffix && (
        <span className="odo__sep" aria-hidden>
          {suffix}
        </span>
      )}
    </span>
  )
}

// Short highlights for the auto-scrolling "wall of love" ribbon.
const highlights = [
  { t: 'Transparent, on-time and truly cared.', n: 'Jalaja M.' },
  { t: 'They went above and beyond.', n: 'D. Dhanasekaran' },
  { t: 'Value up 22% in just 18 months.', n: 'Suresh R.' },
]

/* ── Stacked deck ─────────────────────────────────────────────────────────────
   One card at the front with two layered behind on each side. Depth is a pure
   transform/opacity/filter mapping off the card's offset from the active index,
   so every animated property is compositor-driven.

   Only 3 testimonials exist, so the ring repeats them. Any window wider than 3
   unavoidably repeats a quote — the ±2 rank is therefore blurred to 5px and
   held at 24% opacity so the text there is not readable, and the ordering keeps
   duplicates 3 positions apart so they are never adjacent. */
const DECK_REPEAT = 2
const ROTATE_MS = 5000

/* Two cards share the front rank, so the deck reads as a pair with the rest
   fanned behind on both sides.

   Offset -> (rank, side):  p<=0 goes left at rank -p, p>=1 goes right at rank
   p-1. With 6 slots that fills exactly rank 0/1/2 on each side.

   FRONT_X is half the front pair's footprint; each rank steps further out by
   `dx`. Previously the steps (172/304px) were far smaller than the 560px card,
   so the stack hid behind the front card instead of fanning out. */
const FRONT_X = 232

const DEPTH = [
  { dx: 0, z: 0, scale: 1, opacity: 1, blur: 0, ry: 0 },
  { dx: 250, z: -170, scale: 0.88, opacity: 0.34, blur: 4, ry: 12 },
  { dx: 430, z: -330, scale: 0.78, opacity: 0.16, blur: 7, ry: 16 },
]
const MAX_RANK = DEPTH.length - 1

/* The card is a fixed size, so the quote's type scales to fit it instead.
   1.22rem is the design size; it eases down to a 1.02rem floor as the quote
   gets longer. */
const quoteSize = (len: number) => {
  const size = 1.22 - Math.max(0, len - 115) * 0.0022
  return `${Math.max(1.02, Math.min(1.22, size)).toFixed(3)}rem`
}

const place = (p: number) =>
  p <= 0 ? { rank: -p, side: -1 } : { rank: p - 1, side: 1 }

const DeckCard = ({
  review,
  offset,
  isActive,
}: {
  review: Review
  offset: number
  isActive: boolean
}) => {
  const ref = useRef<HTMLElement>(null)
  const { rank, side } = place(offset)
  const hidden = rank > MAX_RANK
  const d = DEPTH[Math.min(rank, MAX_RANK)]

  // Cursor-driven 3D tilt + glare position (front card only)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el || !isActive) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - y) * 10}deg`)
    el.style.setProperty('--ry', `${(x - 0.5) * 12}deg`)
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <motion.div
      className="tw__slot"
      style={{ zIndex: 20 - rank, pointerEvents: isActive ? 'auto' : 'none' }}
      animate={{
        x: side * (FRONT_X + d.dx),
        z: d.z,
        scale: d.scale,
        rotateY: -side * d.ry,
        opacity: hidden ? 0 : d.opacity,
        filter: `blur(${d.blur}px)`,
      }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden={!isActive}
    >
      <article
        ref={ref}
        className={`tw-card${isActive ? ' is-front' : ''}${review.video ? ' tw-card--video' : ''}`}
        style={
          { '--tw-quote-size': quoteSize(review.quote.length) } as React.CSSProperties
        }
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
      {/* animated gold corner brackets */}
      <span className="tw-bracket tw-bracket--tl" aria-hidden />
      <span className="tw-bracket tw-bracket--br" aria-hidden />

      {/* layered content — different translateZ for parallax depth */}
      {review.video ? (
        <div className="tw-inner tw-inner--video">
          <div className="tw-video-thumb">
            <img src={review.photo} alt={review.name} loading="lazy" />
            <span className="tw-video-scrim" aria-hidden />
            {/* No real video file exists per customer yet — this is a styled
                affordance, not wired to playback. Point it at a real source
                (videoSrc on the Review) once clips are shot/uploaded. */}
            <button
              type="button"
              className="tw-play"
              aria-label={`Play video testimonial from ${review.name}`}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                <path fill="currentColor" d="M8 5.5v13l11-6.5-11-6.5z" />
              </svg>
            </button>
            {review.videoDuration && (
              <span className="tw-video-badge">▶ {review.videoDuration}</span>
            )}
            <div className="tw-video-caption">
              <Stars n={review.rating} />
              <span className="tw-name">{review.name}</span>
              <span className="tw-detail">{review.detail}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="tw-inner">
          <div className="tw-top">
            <div className="tw-avatar">
              <span className="tw-avatar-ring" aria-hidden />
              <img src={review.photo} alt={review.name} loading="lazy" />
            </div>
            <div className="tw-meta">
              <Stars n={review.rating} />
              <span className="tw-google">
                <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M12 11v2.8h4c-.2 1-1.3 3-4 3a4.4 4.4 0 010-8.8c1.3 0 2.1.5 2.6 1l1.9-1.8C15.3 6.1 13.8 5.5 12 5.5a6.5 6.5 0 100 13c3.8 0 6.3-2.6 6.3-6.4 0-.4 0-.7-.1-1H12z"
                  />
                </svg>
                Verified Review
              </span>
            </div>
          </div>

          <span className="tw-quotemark" aria-hidden>
            &ldquo;
          </span>
          <blockquote className="tw-quote">{review.quote}</blockquote>

          <footer className="tw-cite">
            <span className="tw-name">{review.name}</span>
            <span className="tw-detail">{review.detail}</span>
          </footer>
        </div>
      )}
      </article>
    </motion.div>
  )
}

const TestimonialsSection = () => {
  // The ring repeats the source reviews so the deck has enough ranks to fill.
  const deck = useMemo(
    () => Array.from({ length: DECK_REPEAT }, () => reviews).flat(),
    [],
  )
  const n = deck.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (paused || reduce) return
    const id = setInterval(() => setActive((a) => (a + 1) % n), ROTATE_MS)
    return () => clearInterval(id)
  }, [paused, reduce, n])

  // Signed distance to the active card, wrapped so cards travel the short way
  // round rather than sweeping across the stage.
  const offsetOf = (i: number) => {
    let o = (i - active) % n
    if (o > n / 2) o -= n
    if (o < -n / 2) o += n
    return o
  }

  return (
    <section className="tw" aria-label="Customer testimonials">
      <div className="tw__aurora" aria-hidden>
        <span className="tw__blob tw__blob--1" />
        <span className="tw__blob tw__blob--2" />
      </div>
      <header className="tw__header">
        <div>
          <span className="tw__eyebrow">Customer Stories</span>
          <h2 className="tw__title">
            Trusted by <em><Odometer value="7,500" suffix="+" /></em> Happy Customers.
          </h2>
        </div>
        <div className="tw__rating">
          <div className="tw__rating-score">
            <Odometer value="4.9" />
          </div>
          <div>
            <Stars n={5} />
            <div className="tw__rating-sub">
              <Odometer value="300" suffix="+" /> Google Reviews
            </div>
          </div>
        </div>
      </header>

      {/* Auto-rotating stacked deck. Pauses only on keyboard focus — a hover
          pause stopped rotation whenever the cursor merely rested anywhere in
          this full-width band, which read as the rotation being broken. */}
      <div
        className="tw__deck"
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {deck.map((r, i) => {
          const offset = offsetOf(i)
          return (
            <DeckCard
              key={`${r.name}-${i}`}
              review={r}
              offset={offset}
              isActive={place(offset).rank === 0}
            />
          )
        })}
      </div>

      {/* auto-scrolling "wall of love" ribbon */}
      <div className="tw__marquee" aria-hidden>
        <div className="tw__marquee-track">
          {[...highlights, ...highlights, ...highlights].map((h, i) => (
            <span className="tw__chip" key={i}>
              <span className="tw__chip-stars">★★★★★</span>
              <span className="tw__chip-text">{h.t}</span>
              <span className="tw__chip-name">— {h.n}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
