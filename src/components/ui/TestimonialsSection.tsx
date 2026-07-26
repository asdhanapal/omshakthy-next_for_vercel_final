'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './TestimonialsSection.css'

interface Review {
  quote: string
  name: string
  detail: string
  photo: string
  rating: number
}

// Content sourced from the Figma "Customer Stories" section.
// NOTE: `photo` images in /public/testimonials are royalty-free placeholders
// (randomuser.me). Swap them for real customer / licensed Indian portraits.
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
  },
  {
    quote:
      'We invested in Regalia at launch price. In 18 months, the land value has appreciated by over 22%. Best investment of my life.',
    name: 'Suresh Rajan',
    detail: 'OmShakthy Regalia, Avadi',
    photo: '/testimonials/suresh.png',
    rating: 5,
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

const TestimonialCard = ({ review, index }: { review: Review; index: number }) => {
  const ref = useRef<HTMLElement>(null)

  // Cursor-driven 3D tilt + glare position (CSS custom properties)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - y) * 10}deg`)
    el.style.setProperty('--ry', `${(x - 0.5) * 12}deg`)
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <motion.article
      ref={ref}
      className="tw-card"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* moving glare */}
      <span className="tw-glare" aria-hidden />
      {/* animated gold corner brackets */}
      <span className="tw-bracket tw-bracket--tl" aria-hidden />
      <span className="tw-bracket tw-bracket--br" aria-hidden />

      {/* layered content — different translateZ for parallax depth */}
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
    </motion.article>
  )
}

const TestimonialsSection = () => {
  const onSpot = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--sx', `${e.clientX - r.left}px`)
    el.style.setProperty('--sy', `${e.clientY - r.top}px`)
  }

  return (
    <section className="tw" aria-label="Customer testimonials" onMouseMove={onSpot}>
      <div className="tw__aurora" aria-hidden>
        <span className="tw__blob tw__blob--1" />
        <span className="tw__blob tw__blob--2" />
      </div>
      {/* cursor-tracking spotlight across the whole section */}
      <div className="tw__spot" aria-hidden />

      <header className="tw__header">
        <div>
          <span className="tw__eyebrow">Customer Stories</span>
          <h2 className="tw__title">
            Trusted by <em><Odometer value="20,000" suffix="+" /></em> Families.
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

      <div className="tw__grid">
        {reviews.map((r, i) => (
          <TestimonialCard key={r.name} review={r} index={i} />
        ))}
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
