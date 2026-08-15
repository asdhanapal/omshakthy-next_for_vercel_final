'use client'
import { useEffect, useRef, useState } from 'react'
import './CinematicTimeline.css'

const milestones = [
  {
    year: '1991',
    title: 'The Beginning',
    description: 'Founded OmShakthy Agencies (Madras) Private Limited for land aggregation.',
    stat: '1',
    statLabel: 'Company Founded',
    image: '/timeline-1991.png',
  },
  {
    year: '1993',
    title: 'SIDCO Partnership',
    description: 'Acquired 350 acres for SIDCO, establishing credibility.',
    stat: '350',
    statLabel: 'Acres Acquired',
    image: '/timeline-1993.png',
  },
  {
    year: '1997',
    title: 'Mahindra World City',
    description: 'Acquired 2000 acres for Mahindra World City SEZ without litigation.',
    stat: '2,000',
    statLabel: 'Acres for SEZ',
    image: '/timeline-1997.png',
  },
  {
    year: '1998',
    title: 'Construction Era',
    description: 'Entered construction, winning projects close to 5 million sq.ft.',
    stat: '5M',
    statLabel: 'Sq.Ft Projects',
    image: '/timeline-1998.png',
  },
  {
    year: '2000',
    title: 'Corporate Giants',
    description: 'Partnered with Pepsi and Reliance across Tamil Nadu.',
    stat: '40',
    statLabel: 'Acres for Pepsi',
    image: '/timeline-2000.png',
  },
  {
    year: '2024',
    title: 'Legacy Continues',
    description: '35+ years. 7,500+ customers. 7,500+ acres. 30+ projects.',
    stat: '5,000+',
    statLabel: 'Acres Aggregated',
    image: '/timeline-2024.png',
  },
]

const CinematicTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)

  // Keep ref in sync
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  // Expose a handler PageController can call. Returns true if the timeline
  // consumed the scroll (still has milestones left in that direction),
  // false if it's at a boundary and PageController should move sections.
  useEffect(() => {
    (window as any).__timelineAdvance = (dir: number) => {
      const next = activeIndexRef.current + dir
      if (next >= 0 && next < milestones.length) {
        setActiveIndex(next)
        return true // consumed
      }
      return false // boundary — let page move
    }
    // Allows PageController to reset the timeline back to the first slide
    // when the user scrolls away from it (e.g. scrolling up past it).
    ;(window as any).__timelineReset = () => {
      setActiveIndex(0)
    }
    return () => {
      delete (window as any).__timelineAdvance
      delete (window as any).__timelineReset
    }
  }, [])

  return (
    <div className="ct-section">
      <div
        className="ct-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {milestones.map((m, i) => (
          <div
            className={`ct-slide ${i === activeIndex ? 'ct-slide--active' : ''}`}
            key={i}
          >
            <div className="ct-slide__bgwrap">
              <div
                className="ct-slide__bg"
                style={{
                  backgroundImage: `url(${m.image})`,
                  backgroundPosition: m.image === '/timeline-1997.png' ? 'center 50%' : m.image === '/timeline-1998.png' ? 'center 40%' : ['/timeline-1993.png', '/timeline-2000.png', '/timeline-2024.png'].includes(m.image) ? 'center 30%' : 'center',
                  backgroundSize: 'cover',
                }}
              />
            </div>
            <div className="ct-slide__overlay" />
          </div>
        ))}
      </div>

      {/* Innovative timeline progress bar */}
      <div className="ct-bar">
        {/* Big morphing year on the left */}
        <div className="ct-bar__bigyear">
          <span className="ct-bar__bigyear-text" key={activeIndex}>
            {milestones[activeIndex].year}
          </span>
          <span className="ct-bar__bigyear-label">{milestones[activeIndex].title}</span>
        </div>

        {/* Segmented liquid-fill progress */}
        <div className="ct-bar__segments">
          {milestones.map((m, i) => (
            <button
              key={i}
              className={`ct-seg ${i === activeIndex ? 'ct-seg--active' : ''} ${i < activeIndex ? 'ct-seg--done' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <span className="ct-seg__fill" />
              <span className="ct-seg__year">{m.year}</span>
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="ct-bar__counter">
          <span className="ct-bar__counter-current">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="ct-bar__counter-total">/ {String(milestones.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}

export default CinematicTimeline
