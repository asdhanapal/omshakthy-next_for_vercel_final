'use client'
import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import './LeadersSection.css'

const featured = {
  eyebrow: 'Leadership That Inspires',
  bigName: 'Manigantan',
  name: 'N R Manigantan',
  role: 'Managing Director',
  portrait: '/leaders/manigantan.png',
  points: [
    'More than 2 decades of experience in Real Estate & Construction',
    'Extensive knowledge in land acquisition & agglomeration',
    'A clear vision on industrial infrastructure development & asset building',
    'Steering OmShakthy from a ₹2,500 Cr to a ₹5,000 Cr group',
  ],
}

const EASE = [0.16, 1, 0.3, 1] as const
const SPRING = { stiffness: 60, damping: 20, mass: 0.8 }
const SLICES = 8 // vertical slices the portrait assembles from

/* ---- entrance variants (played when the section snaps into view) ---- */
const emblemV: Variants = {
  hidden: { scale: 0.3, opacity: 0, rotate: -70 },
  show: { scale: 1, opacity: 0.07, rotate: 0, transition: { duration: 2.1, ease: EASE } },
}
const nameWrapV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
}
// each letter flies in from alternating top/bottom, rotated + blurred
const letterV: Variants = {
  hidden: (i: number) => ({
    y: i % 2 === 0 ? '-130%' : '130%',
    opacity: 0,
    rotateZ: i % 2 === 0 ? -18 : 18,
    filter: 'blur(10px)',
  }),
  show: {
    y: '0%',
    opacity: 1,
    rotateZ: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.15, ease: EASE },
  },
}
const portraitSlicesV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.5 } },
}
// each vertical slice flies in from alternating top/bottom and locks into place
const sliceV: Variants = {
  hidden: (i: number) => ({
    y: i % 2 === 0 ? '-45%' : '45%',
    opacity: 0,
    filter: 'blur(12px)',
  }),
  show: {
    y: '0%',
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.15, ease: EASE },
  },
}
const glowV: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.3, delay: 1.7, ease: EASE } },
}
const lineV: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.9, delay: 1.5, ease: EASE } },
}
const contentV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 1.75 } },
}
const itemV: Variants = {
  hidden: { opacity: 0, x: -34 },
  show: { opacity: 1, x: 0, transition: { duration: 0.95, ease: EASE } },
}
const pointsWrapV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
}

const LeadersSection = () => {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  // replays every time the section snaps into / out of view
  const inView = useInView(ref, { amount: 0.55 })
  const state = reduce || inView ? 'show' : 'hidden'

  // pointer parallax (depth) layered on top of the entrance sequence
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, SPRING)
  const sy = useSpring(py, SPRING)
  const emblemX = useTransform(sx, (v) => v * 10)
  const emblemY = useTransform(sy, (v) => v * 10)
  const nameX = useTransform(sx, (v) => v * 26)
  const nameY = useTransform(sy, (v) => v * 12)
  const portraitX = useTransform(sx, (v) => v * -20)
  const portraitY = useTransform(sy, (v) => v * -12)
  const contentX = useTransform(sx, (v) => v * 36)
  const contentY = useTransform(sy, (v) => v * 20)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <section
      ref={ref}
      className="lead"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label="Leadership"
    >
      {/* Layer 0 — branded emblem, parallax wrapper + entrance */}
      <motion.div className="lead__emblem-wrap" style={{ x: emblemX, y: emblemY }}>
        <motion.img
          src="/leaders/emblem.png"
          alt=""
          aria-hidden
          className="lead__emblem"
          variants={emblemV}
          initial="hidden"
          animate={state}
        />
      </motion.div>

      {/* Layer 1 — giant name assembling behind the subject */}
      <motion.div className="lead__name-wrap" style={{ x: nameX, y: nameY }}>
        <motion.span
          className="lead__bigname"
          aria-hidden
          variants={nameWrapV}
          initial="hidden"
          animate={state}
        >
          {featured.bigName.split('').map((ch, i) => (
            <motion.span className="lead__letter" key={i} custom={i} variants={letterV}>
              {ch}
            </motion.span>
          ))}
        </motion.span>
      </motion.div>

      {/* Layer 2 — cut-out portrait assembles from vertical slices */}
      <motion.div className="lead__portrait-wrap" style={{ x: portraitX, y: portraitY }}>
        <motion.span className="lead__portrait-glow" variants={glowV} initial="hidden" animate={state} aria-hidden />
        <div className="lead__portrait">
          <motion.div
            className="lead__slices"
            variants={portraitSlicesV}
            initial="hidden"
            animate={state}
          >
            {Array.from({ length: SLICES }).map((_, i) => {
              const w = 100 / SLICES
              const l = Math.max(0, i * w - 0.6)
              const r = Math.max(0, 100 - (i + 1) * w - 0.6)
              return (
                <motion.div
                  key={i}
                  className="lead__slice"
                  custom={i}
                  variants={sliceV}
                  style={{ clipPath: `inset(0 ${r}% 0 ${l}%)` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.portrait}
                    alt={i === 0 ? `${featured.name}, ${featured.role}` : ''}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Layer 3 — foreground content arranging in */}
      <motion.div className="lead__content" style={{ x: contentX, y: contentY }}>
        <motion.div className="lead__inner" variants={contentV} initial="hidden" animate={state}>
          <div className="lead__head">
            <motion.span className="lead__eyebrow" variants={itemV}>
              {featured.eyebrow}
            </motion.span>
            <div className="lead__namerow">
              <motion.span className="lead__rule" variants={lineV} aria-hidden />
              <div>
                <motion.h2 className="lead__name" variants={itemV}>
                  {featured.name}
              </motion.h2>
              <motion.span className="lead__role" variants={itemV}>
                {featured.role}
              </motion.span>
            </div>
          </div>
          </div>
          <motion.ul className="lead__points" variants={pointsWrapV}>
            {featured.points.map((p, i) => (
              <motion.li key={i} variants={itemV}>
                {p}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default LeadersSection
