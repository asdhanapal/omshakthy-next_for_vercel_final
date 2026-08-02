'use client'
import { useEffect, useRef, useState } from 'react'
import './MilestoneSection.css'

/* ─── OmShakthy milestone data ─── */
const MILESTONES = [
  {
    num: 'I',
    date: '1991',
    tag: 'Milestone I',
    title: 'Founded OmShakthy Agencies',
    desc: 'Incorporated OmShakthy Agencies (Madras) Pvt Ltd for the purpose of land aggregation — the seed of a legacy.',
    stats: [['1', 'Company Founded'], ['Chennai', 'Headquarters'], ['Land', 'Aggregation Focus']],
    icon: 'doc',
  },
  {
    num: 'II',
    date: '1993',
    tag: 'Milestone II',
    title: 'SIDCO Partnership',
    desc: 'Acquired 350 acres for SIDCO, establishing OmShakthy as a trusted partner for Government projects.',
    stats: [['350', 'Acres Acquired'], ['SIDCO', 'Partner'], ['Zero', 'Litigation']],
    icon: 'arch',
  },
  {
    num: 'III',
    date: '1997',
    tag: 'Milestone III',
    title: 'Mahindra World City',
    desc: 'Aggregated 2,000 acres for Mahindra World City Special Economic Zone at Chengelpet — without a single legal dispute.',
    stats: [['2,000', 'Acres'], ['SEZ', 'Project Type'], ['Zero', 'Disputes']],
    icon: 'plug',
  },
  {
    num: 'IV',
    date: '1998',
    tag: 'Milestone IV',
    title: 'Construction Era',
    desc: 'Entered construction as a contractor, winning and delivering projects close to 5 million sq.ft with uncompromising quality.',
    stats: [['5M', 'Sq.Ft Built'], ['Pepsi', 'Client'], ['Reliance', 'Client']],
    icon: 'qa',
  },
  {
    num: 'V',
    date: '2024',
    tag: 'Milestone V',
    title: 'Legacy Continues',
    desc: '35+ years of trust. 7,500+ happy customers. 7,500+ acres aggregated. 30+ landmark projects. ₹2,000+ Crores in transactions. The journey from a single acre to an empire of real assets.',
    stats: [['7,500+', 'Acres Developed'], ['30+', 'Projects Delivered'], ['₹2,000+ Cr', 'Transactions']],
    icon: 'crown',
  },
]

const NUM = MILESTONES.length

const ICONS: Record<string, string> = {
  doc: '<rect x="6" y="8" width="36" height="32" rx="2"/><path d="M6 16h36M16 8v8M32 8v8"/><path d="M14 24h8M14 30h12M14 36h6" opacity=".55"/>',
  arch: '<circle cx="24" cy="24" r="18"/><path d="M24 6v4M24 38v4M6 24h4M38 24h4"/><circle cx="24" cy="24" r="8" opacity=".55"/><path d="M20 24l3 3 5-6"/>',
  plug: '<path d="M8 38V18l16-10 16 10v20"/><path d="M18 38V26h12v12" opacity=".55"/><circle cx="24" cy="18" r="3"/>',
  qa: '<path d="M10 38l6-10 6 6 8-14 8 10"/><rect x="6" y="8" width="36" height="32" rx="2"/><circle cx="36" cy="14" r="2" opacity=".55"/>',
  crown: '<path d="M24 4l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8z"/><path d="M14 34l-4 10M34 34l4 10" opacity=".45"/>',
}

export default function MilestoneSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let gsapLoaded = false

    const initGSAP = async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsapLoaded = true

      const stage = section.querySelector('#msStage') as HTMLElement
      if (!stage) return

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => '+=' + (window.innerHeight * (NUM - 1) * 0.9),
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        snap: {
          snapTo: 1 / (NUM - 1),
          duration: { min: 0.2, max: 0.5 },
          delay: 0.06,
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          setProgress(self.progress)
          setActive(Math.round(self.progress * (NUM - 1)))
        },
      })
    }

    initGSAP()

    return () => {
      if (gsapLoaded) {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.getAll().forEach((t) => t.kill())
        })
      }
    }
  }, [])

  const handleNodeClick = (idx: number) => {
    const section = sectionRef.current
    if (!section) return
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      const trig = ScrollTrigger.getAll().find(
        (t) => t.pin === section.querySelector('#msStage')
      )
      if (trig) {
        window.scrollTo({
          top: trig.start + (trig.end - trig.start) * (idx / (NUM - 1)),
          behavior: 'smooth',
        })
      }
    })
  }

  return (
    <section className="ms-section" ref={sectionRef}>
      <div className="ms-stage" id="msStage">
        {/* Atmosphere */}
        <div className="ms-atmosphere" aria-hidden="true">
          <div className="ms-aurora" />
          <div className="ms-horizon" />
          <div className="ms-vignette" />
          <div className="ms-grain" />
        </div>

        {/* Particles */}
        <div className="ms-particles" aria-hidden="true">
          {Array.from({ length: 15 }).map((_, i) => {
            // Seeded pseudo-random based on index to avoid hydration mismatch
            const seed = (i + 1) * 7.3
            const w = 1 + (seed % 1.5)
            const left = ((seed * 13.7) % 100)
            const top = 60 + ((seed * 3.1) % 40)
            const dur = 6 + ((seed * 2.3) % 8)
            const delay = ((seed * 1.7) % 5)
            const peak = 0.15 + ((seed * 0.9) % 0.2)
            const drift = -(80 + ((seed * 4.1) % 120))
            return (
              <div
                key={i}
                className="ms-p"
                style={{
                  width: `${w}px`,
                  height: `${w}px`,
                  left: `${left}%`,
                  top: `${top}%`,
                  '--dur': `${dur}s`,
                  '--delay': `${delay}s`,
                  '--peak': `${peak}`,
                  '--drift': `${drift}px`,
                } as React.CSSProperties}
              />
            )
          })}
        </div>

        {/* Header */}
        <div className="ms-head">
          <span className="ms-eyebrow">OmShakthy · Since 1991</span>
          <h2>Project Milestones</h2>
          <p>The journey from a single acre to an empire of real assets</p>
          <span className="ms-count-inline">
            <b>{String(active + 1).padStart(2, '0')}</b>of {String(NUM).padStart(2, '0')} milestones
          </span>
        </div>

        {/* Progress rail */}
        <div className="ms-progress">
          <div className="ms-rail">
            <div className="ms-rail-glow" style={{ width: `${progress * 100}%` }} />
            <div className="ms-rail-fill" style={{ width: `${progress * 100}%` }} />
            <div className="ms-nodes" role="tablist" aria-label="Milestones">
              {MILESTONES.map((m, i) => (
                <button
                  key={i}
                  className={`ms-node ${i < active ? 'done' : ''} ${i === active ? 'active' : ''}`}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Milestone ${i + 1}: ${m.title}`}
                  onClick={() => handleNodeClick(i)}
                >
                  <span className="ms-hit" />
                </button>
              ))}
            </div>
          </div>
          <div className="ms-dates">
            {MILESTONES.map((m, i) => (
              <span key={i} className={`ms-date ${i < active ? 'done' : ''} ${i === active ? 'active' : ''}`}>
                {m.date}
              </span>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="ms-cards">
          {MILESTONES.map((m, i) => (
            <article
              key={i}
              className={`ms-card ${i === active ? 'visible' : ''}`}
              role="tabpanel"
              aria-label={`${m.tag}: ${m.title}`}
            >
              <div className="ms-visual" aria-hidden="true">
                <div className="ms-numeral">{m.num}</div>
                <div className="ms-icon-svg">
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    dangerouslySetInnerHTML={{ __html: ICONS[m.icon] }}
                  />
                </div>
              </div>
              <div className="ms-content">
                <div className="ms-tag">{m.tag}</div>
                <h3 className="ms-title">{m.title}</h3>
                <p className="ms-desc">{m.desc}</p>
                {m.stats && (
                  <div className="ms-metric">
                    <div className="ms-stats">
                      {m.stats.map(([v, k], si) => (
                        <div key={si}>
                          <div className="sv">{v}</div>
                          <div className="sk">{k}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="ms-foot">
                  <span className="ms-date-badge">{m.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="ms-cue" style={{ opacity: progress > 0.04 ? 0 : 1 }}>
          <span>Scroll to advance</span>
          <div className="chevrons">
            <i /><i /><i />
          </div>
        </div>
      </div>
    </section>
  )
}
