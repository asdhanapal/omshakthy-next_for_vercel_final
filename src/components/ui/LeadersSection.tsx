'use client'
import './LeadersSection.css'

const COMPANY = 'OmShakthy Agencies'
const LOGO = '/omshakthy-logo.png'
const FLAG = '🇮🇳'

const prime = {
  name: 'R. Ramachandran',
  role: 'Chairman',
  photo: '/leaders/chairman.png',
}

const secondary = [
  { name: 'N R Manigantan', role: 'Managing Director', photo: '/leaders/md.png' },
  { name: 'Rajib Kumar Hota', role: 'Executive Director', photo: '/leaders/hota.png' },
  { name: 'Shakthi', role: 'Executive Director', photo: null },
  { name: null, role: null, photo: null, reserved: true },
]

function Badge() {
  return (
    <span className="lead__badge">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO} alt="OmShakthy" />
      <span>{COMPANY}</span>
    </span>
  )
}

export default function LeadersSection() {
  return (
    <section className="lead">
      <div className="lead__header">
        <span className="lead__eyebrow">Our Leadership</span>
        <h2 className="lead__title">The People Behind the Promise</h2>
      </div>

      <div className="lead__wrap">
        {/* ── Prime card — Chairman ── */}
        <article className="lead__card lead__card--prime">
          <div className="lead__info">
            <h3 className="lead__name">{prime.name}</h3>
            <span className="lead__role">
              <span className="lead__flag">{FLAG}</span> {prime.role}
            </span>
            <Badge />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lead__photo" src={prime.photo} alt={prime.name} />
        </article>

        {/* ── 2×2 grid ── */}
        <div className="lead__secondary">
          {secondary.map((person, i) => {
            if (person.reserved) {
              return (
                <article className="lead__card lead__card--sec lead__card--reserved" key={`res-${i}`}>
                  <span className="lead__reserved-icon" aria-hidden="true">+</span>
                  <span className="lead__reserved-text">To be announced</span>
                </article>
              )
            }
            return (
              <article className="lead__card lead__card--sec" key={person.name}>
                <div className="lead__info">
                  <h3 className="lead__name">{person.name}</h3>
                  <span className="lead__role">
                    <span className="lead__flag">{FLAG}</span> {person.role}
                  </span>
                  <Badge />
                </div>
                {person.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="lead__photo" src={person.photo} alt={person.name ?? ''} />
                ) : (
                  <div className="lead__mono" aria-hidden="true">{person.name?.[0]}</div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
