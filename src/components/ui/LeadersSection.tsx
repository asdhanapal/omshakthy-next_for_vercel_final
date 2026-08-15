'use client'
import './LeadersSection.css'

/* Ported from the "page3" leadership layout (portrait card roster +
   editorial intro band) — replaces the previous hover-accordion design.
   Content is Omshakthy's real leadership (same four people/photos/bios the
   old version used), not the source demo's placeholder team. The source
   also had a "values" strip (icons + a "Join our team" link) below the
   roster; dropped per request. */

type Leader = {
  name: string
  role: string
  tag: string
  // No `img` = no real photo exists yet (see Shakthi below) — renders an
  // initials placeholder instead of misattributing someone else's photo.
  img?: string
  pos: string
  size: string
}

const leaders: Leader[] = [
  {
    name: 'R. Ramachandran',
    role: 'Chairman',
    tag: 'Vision & Legacy',
    img: '/leaders/chairman.png',
    // Same photo/pose as the page3 source's own reference crop for this
    // person — using its exact values rather than my own estimate.
    pos: '38% 6%',
    size: 'auto 168%',
  },
  {
    name: 'N R Manigantan',
    role: 'Managing Director',
    tag: 'Strategy & Growth',
    img: '/leaders/manigantan.png',
    pos: '44% 8%',
    size: 'auto 138%',
  },
  {
    name: 'Rajib Kumar Hota',
    role: 'Executive Director',
    tag: 'Governance & Ethics',
    img: '/leaders/hota.png',
    pos: 'center 22%',
    size: 'cover',
  },
  {
    name: 'Shakthi',
    role: 'Executive Director',
    tag: 'To Be Announced',
    // No distinct photo exists — every "Shakthi" asset in /public/leaders
    // (md-cutout.png) is byte-identical to manigantan.png. That's someone
    // else's actual face, not a placeholder, so it doesn't belong here.
    pos: 'center 15%',
    size: 'cover',
  },
]

const stats = [
  { value: '30+', label: 'Years' },
  { value: '1991', label: 'Founded' },
  { value: '20,000+', label: 'Families' },
  { value: '₹5,000CR+', label: 'and Growing' },
]

function Card({ leader, index }: { leader: Leader; index: number }) {
  return (
    <article className="ld3__card" style={{ animationDelay: `${0.2 + index * 0.09}s` }}>
      <div className="ld3__media">
        {leader.img ? (
          <span
            className="ld3__photo"
            style={{ backgroundImage: `url(${leader.img})`, backgroundPosition: leader.pos, backgroundSize: leader.size }}
          />
        ) : (
          <div className="ld3__photo-placeholder" aria-hidden>
            <span>{leader.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="ld3__body">
        <h3 className="ld3__name">{leader.name}</h3>
        <p className="ld3__role">{leader.role}</p>
        <p className="ld3__tag">{leader.tag}</p>
      </div>
    </article>
  )
}

const LeadersSection = () => {
  return (
    <section className="ld3" id="leadership" data-snap="true" aria-label="Our leadership" data-header-theme="transparent">
      <div className="ld3__intro">
        <div>
          <p className="ld3__eyebrow">
            <span className="ld3__eyebrow-line" />
            OUR LEADERSHIP
            <span className="ld3__eyebrow-line" />
          </p>
          <h1 className="ld3__h1">
            Three decades. One unwavering <span className="ld3__accent">vision.</span>
          </h1>
        </div>
        <div className="ld3__intro-side">
          <p className="ld3__lead">
            Three decades of real estate leadership — built on trust, land
            expertise and an unwavering commitment to every family we serve.
          </p>
          <div className="ld3__meta">
            {stats.map((s) => (
              <span key={s.label}>
                <b>{s.value}</b>
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ld3__roster">
        {leaders.map((leader, i) => (
          <Card key={leader.name} leader={leader} index={i} />
        ))}
      </div>
    </section>
  )
}

export default LeadersSection
