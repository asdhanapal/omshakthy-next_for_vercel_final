'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useSectionEnter } from '@/lib/useSectionEnter'
import './TrustedPartnersSection.css'

/* ============================================================
   TrustedPartnersSection
   Combines two Figma sections onto one ivory-background page:
   1. "Trusted Developers in Chennai" — 5 service pillars
   2. "Financial Partners" — bank/partner logo strip
   ============================================================ */

const pillars = [
  {
    title: 'Land Aggregation',
    desc: 'Immense knowledge of land and its value, sound research and extended expertise in the realms of real estate properties.',
  },
  {
    title: 'Residential Development',
    desc: 'Utmost care in revitalization efforts to improve community life across all residential projects that are undertaken.',
  },
  {
    title: 'Hospitality Management',
    desc: 'Qualified and well trained individuals that provide quick and relevant solutions for all forms of support services.',
  },
  {
    title: 'Commercial Projects',
    desc: 'Complete transparency in price, regulations, schedule and documentation allows for smooth execution of commercial projects.',
  },
  {
    title: 'Supply Chain Management',
    desc: 'Complete transparency in price, regulations, schedule and documentation allows for smooth execution of commercial projects.',
  },
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

const TrustedPartnersSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const built = useSectionEnter(sectionRef, 150)

  return (
    <section ref={sectionRef} className="tp" aria-label="Trusted developers and financial partners" data-header-theme="light">
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
          <header className="tp__header">
            <span className="tp__eyebrow">Since 1991</span>
            <motion.h2
              className="tp__title"
              initial={{ opacity: 0, y: 30 }}
              animate={built ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, ease: EASE }}
            >
              Trusted Developers <em>in Chennai.</em>
            </motion.h2>
            <motion.p
              className="tp__intro"
              initial={{ opacity: 0, y: 24 }}
              animate={built ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: EASE, delay: 0.22 }}
            >
              OmShakthy Agencies (Madras) Private Limited (OSAL) was incorporated in 1991
              with the purpose to consolidate land that would be used for projects in the
              future.
            </motion.p>
          </header>

          {/* Background video — wraps the pillars area only, so it starts
              right where the header ends (this container begins right
              after </header>) and fills down to where this area ends. */}
          <div className="tp__video-band">
            <video
              className="tp__bg-video"
              src="/trusted-partners-bg.mp4"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
            <div className="tp__bg-overlay" aria-hidden="true" />

            <div className="tp__pillars">
              {pillars.map((p, i) => (
                <motion.div
                  className="tp__pillar"
                  key={p.title}
                  initial={{ opacity: 0, y: 34 }}
                  animate={built ? { opacity: 1, y: 0 } : {}}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 4 + i * 0.14 }}
                >
                  <h3 className="tp__pillar-title">{p.title}</h3>
                  <p className="tp__pillar-desc">{p.desc}</p>
                  <span className="tp__pillar-explore">Explore →</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Financial Partners ── */}
        <div className="tp__bottom">
          <span className="tp__partners-label">Financial Partners</span>
          <motion.h3
            className="tp__partners-title"
            initial={{ opacity: 0, y: 24 }}
            animate={built ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
          >
            Trusted by India&rsquo;s <em>Leading Financial Institutions.</em>
          </motion.h3>
          <div className="tp__logos">
            {partnerLogos.map((p, i) => (
              <motion.div
                className="tp__logo"
                key={p.name}
                initial={{ opacity: 0, y: 18 }}
                animate={built ? { opacity: 1, y: 0 } : {}}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.75, ease: EASE, delay: 0.45 + i * 0.11 }}
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
