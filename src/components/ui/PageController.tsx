'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import './PageController.css'

interface PageControllerProps {
  children: React.ReactNode[]
}

const PageController = ({ children }: PageControllerProps) => {
  const [currentSection, setCurrentSection] = useState(0)
  const isAnimating = useRef(false)
  const totalSections = children.length

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= totalSections || isAnimating.current) return
    isAnimating.current = true
    setCurrentSection(index)
    setTimeout(() => { isAnimating.current = false }, 750)
  }, [totalSections])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()

    // Block all section navigation while the intro overlay is still on screen
    // (keyhole + video + swipe). This prevents scrolling from advancing the
    // hidden sections in the background and landing the user on the wrong page.
    if (document.querySelector('.intro-section')) return

    if (isAnimating.current) return
    if (Math.abs(e.deltaY) < 8) return

    const dir = e.deltaY > 0 ? 1 : -1

    // If current section is the timeline (index 2):
    // - Scrolling down steps through the horizontal milestones one at a time.
    // - Scrolling up skips that and exits the section immediately (one scroll
    //   up moves straight to the previous page section).
    const timelineAdvance = (window as any).__timelineAdvance
    const timelineReset = (window as any).__timelineReset
    if (currentSection === 2 && dir === 1 && typeof timelineAdvance === 'function') {
      const consumed = timelineAdvance(dir)
      if (consumed) {
        // Timeline handled it — block section change briefly
        isAnimating.current = true
        setTimeout(() => { isAnimating.current = false }, 700)
        return
      }
      // Boundary reached — fall through to move sections
    }

    if (currentSection === 2 && dir === -1 && typeof timelineReset === 'function') {
      timelineReset()
    }

    goTo(currentSection + dir)
  }, [currentSection, goTo])

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Expose current section & notify listeners (header padding, etc.)
  useEffect(() => {
    (window as any).__pageControllerCurrentSection = currentSection
    window.dispatchEvent(new Event('pageSectionChange'))
  }, [currentSection])

  return (
    <div className="page-controller">
      <div
        className="page-controller__track"
        style={{ transform: `translateY(-${currentSection * 100}vh)` }}
      >
        {children.map((child, i) => (
          <div className="page-controller__section" key={i}>
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PageController
