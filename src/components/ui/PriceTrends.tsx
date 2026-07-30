'use client'
import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import './PriceTrends.css'

interface Series {
  name: string
  color: string
  yoy: string
  values: number[]
}

const quarters = ["Q1'24", "Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25", "Q4'25"]
const series: Series[] = [
  { name: 'Tambaram', color: '#8DB4D1', yoy: '+12.5%', values: [2100, 2250, 2380, 2500, 2600, 2690, 2750, 2800] },
  { name: 'Avadi', color: '#C8A15A', yoy: '+18.2%', values: [4200, 4480, 4700, 4900, 5100, 5260, 5390, 5500] },
  { name: 'Guduvancheri', color: '#6BCB77', yoy: '+22.4%', values: [5500, 5900, 6250, 6600, 6900, 7130, 7320, 7500] },
]

// Blogs — the Avadi property-tax post is from Figma; the others are derived.
const blogs = [
  {
    date: 'Aug 21, 2024',
    cat: 'Latest Buzz',
    read: '4 min read',
    title: 'How to Pay Avadi Municipality Property Tax Online',
    excerpt:
      'Paying your Avadi property tax online is fast, secure and skips the queues. A simple step-by-step guide for homeowners.',
    image: '/blog/b1.jpg',
  },
  {
    date: 'Jan 21, 2023',
    cat: 'Market',
    read: '6 min read',
    title: "Why Guduvancheri is Chennai's Next Growth Corridor",
    excerpt:
      'Metro expansion, SIPCOT corridors and new townships are turning Guduvancheri into one of the fastest-appreciating belts in the city.',
    image: '/blog/b2.jpg',
  },
  {
    date: 'Jun 21, 2022',
    cat: 'Events',
    read: '3 min read',
    title: 'Life at Omshakthy: Community & Milestones',
    excerpt:
      'From community drives to milestone celebrations — a look at the people, culture and moments that shape life across Omshakthy.',
    image: '/blog/b3.jpg',
  },
]

const W = 800
const H = 230
const padL = 6
const padR = 6
const padT = 14
const padB = 26
const plotW = W - padL - padR
const plotH = H - padT - padB
const maxY = 8000
const gridVals = [2000, 4000, 6000, 8000]
const N = quarters.length

const xAt = (i: number) => padL + (i / (N - 1)) * plotW
const yAt = (v: number) => padT + (1 - v / maxY) * plotH
const linePath = (vals: number[]) =>
  vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ')
const areaPath = (vals: number[]) =>
  `${linePath(vals)} L${xAt(N - 1).toFixed(1)},${yAt(0)} L${xAt(0).toFixed(1)},${yAt(0)} Z`
const interp = (vals: number[], t: number) => {
  const i = Math.floor(t)
  if (i >= N - 1) return vals[N - 1]
  return vals[i] + (vals[i + 1] - vals[i]) * (t - i)
}
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))
const EASE = [0.16, 1, 0.3, 1] as const

const PriceTrends = () => {
  const ref = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const state = inView ? 'show' : 'hidden'

  const [scrub, setScrub] = useState(N - 1)
  const [active, setActive] = useState(false)
  const [isolated, setIsolated] = useState<number | null>(null)
  const qIndex = Math.round(scrub)

  const onChartMove = (e: React.MouseEvent) => {
    const svg = svgRef.current
    if (!svg) return
    const r = svg.getBoundingClientRect()
    const relX = (e.clientX - r.left) / r.width
    setScrub(clamp(((relX * W - padL) / plotW) * (N - 1), 0, N - 1))
    setActive(true)
  }
  const onChartLeave = () => {
    setActive(false)
    setScrub(N - 1)
  }

  // journal master-detail
  const [openIdx, setOpenIdx] = useState(0)
  const cursorX = xAt(scrub)
  const post = blogs[openIdx]

  return (
    <section ref={ref} className="mp" aria-label="Market intelligence">
      <motion.img
        src="/leaders/emblem.png"
        alt=""
        aria-hidden
        className="mp__watermark"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: state === 'show' ? 0.05 : 0, scale: state === 'show' ? 1 : 0.85 }}
        transition={{ duration: 1.6, ease: EASE }}
      />
      <div className="mp__aurora" aria-hidden>
        <span className="mp__blob mp__blob--1" />
        <span className="mp__blob mp__blob--2" />
      </div>
      <div className="mp__grain" aria-hidden />

      <header className="mp__header">
        <span className="mp__eyebrow">Market Intelligence · 2024</span>
        <h2 className="mp__title">
          Price Trends <em>at a Glance.</em>
        </h2>
      </header>

      <div className="mp__body">
        {/* LEFT — price intelligence */}
        <div className="mp__left">
          <div className="mp__ladder">
            {series.map((s, i) => {
              const live = Math.round(interp(s.values, scrub) / 10) * 10
              return (
                <button
                  key={s.name}
                  className={`mp__rung ${isolated !== null && isolated !== i ? 'is-dim' : ''} ${
                    isolated === i ? 'is-active' : ''
                  }`}
                  onMouseEnter={() => setIsolated(i)}
                  onMouseLeave={() => setIsolated(null)}
                  style={{ ['--c' as string]: s.color }}
                >
                  <span className="mp__rung-key" aria-hidden />
                  <span className="mp__rung-name">{s.name}</span>
                  <span className="mp__rung-price">₹{live.toLocaleString('en-IN')}</span>
                  <span className="mp__rung-yoy">▲ {s.yoy}</span>
                </button>
              )
            })}
          </div>

          <div className="mp__chartband">
            <div className="mp__chart-cap">
              <span>Price / sq.ft · Quarterly</span>
              <span className={`mp__qbadge ${active ? 'is-live' : ''}`}>{quarters[qIndex]}</span>
            </div>
            <svg
              ref={svgRef}
              className="mp__chart"
              viewBox={`0 0 ${W} ${H}`}
              onMouseMove={onChartMove}
              onMouseLeave={onChartLeave}
              preserveAspectRatio="none"
              role="img"
              aria-label="Price trend ribbons by quarter"
            >
              <defs>
                {series.map((s) => (
                  <linearGradient key={s.name} id={`mp-fill-${s.name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>
              {gridVals.map((g) => (
                <line key={g} className="mp__grid" x1={padL} x2={W - padR} y1={yAt(g)} y2={yAt(g)} />
              ))}
              {series.map((s, si) => {
                const dim = isolated !== null && isolated !== si
                const focus = isolated === si
                return (
                  <g key={s.name} className={`mp__ribbon ${dim ? 'is-dim' : ''} ${focus ? 'is-focus' : ''}`}>
                    <motion.path
                      d={areaPath(s.values)}
                      fill={`url(#mp-fill-${s.name})`}
                      className="mp__area"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: state === 'show' ? 1 : 0 }}
                      transition={{ duration: 0.9, delay: 0.5 + si * 0.18, ease: 'easeOut' }}
                    />
                    <motion.path
                      d={linePath(s.values)}
                      fill="none"
                      stroke={s.color}
                      className="mp__line"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: state === 'show' ? 1 : 0 }}
                      transition={{ duration: 1.4, delay: si * 0.18, ease: EASE }}
                    />
                  </g>
                )
              })}
              {inView && (
                <g>
                  <line className="mp__scan" x1={cursorX} x2={cursorX} y1={padT - 6} y2={yAt(0)} />
                  {series.map((s, si) => {
                    const dim = isolated !== null && isolated !== si
                    return (
                      <circle
                        key={s.name}
                        cx={cursorX}
                        cy={yAt(interp(s.values, scrub))}
                        r={4}
                        fill={s.color}
                        className="mp__scan-dot"
                        style={{ opacity: dim ? 0.15 : 1 }}
                      />
                    )
                  })}
                </g>
              )}
            </svg>
            <div className="mp__axis">
              {quarters.map((q) => (
                <span key={q}>{q}</span>
              ))}
            </div>
          </div>
          <div className="mp__source">Source: OmShakthy Research Division · Data updated Q4 2024</div>
        </div>

        {/* RIGHT — journal (master-detail: hover a title, the article opens large) */}
        <aside className="mp__journal">
          <span className="mp__journal-label" aria-hidden>
            JOURNAL
          </span>
          <div className="mp__journal-head">
            <h3 className="mp__journal-title">Latest <em>Blogs</em></h3>
            <a className="mp__journal-all" href="/blog">
              View all →
            </a>
          </div>

          {/* large open content */}
          <div className="mp__feature">
            <AnimatePresence mode="wait">
              <motion.a
                key={openIdx}
                href="/blog"
                className="mp__feature-card"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt="" className="mp__feature-img" />
                <div className="mp__feature-shade" />
                <div className="mp__feature-body">
                  <div className="mp__feature-meta">
                    <span className="mp__feature-cat">{post.cat}</span>
                    <span>{post.date}</span>
                    <span>· {post.read}</span>
                  </div>
                  <h4 className="mp__feature-title">{post.title}</h4>
                  <p className="mp__feature-excerpt">{post.excerpt}</p>
                  <span className="mp__feature-read">Read article →</span>
                </div>
              </motion.a>
            </AnimatePresence>
          </div>

          {/* selector list */}
          <ul className="mp__select">
            {blogs.map((b, i) => (
              <li
                key={b.title}
                className={`mp__select-item ${openIdx === i ? 'is-active' : ''}`}
                onMouseEnter={() => setOpenIdx(i)}
                onClick={() => setOpenIdx(i)}
              >
                <span className="mp__select-index">0{i + 1}</span>
                <span className="mp__select-title">{b.title}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}

export default PriceTrends
