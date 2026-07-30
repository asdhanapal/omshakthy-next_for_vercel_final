'use client'

import IntroSection from '@/components/ui/IntroSection'
import HeroSlider from '@/components/ui/HeroSlider'
import PropertyGrid from '@/components/ui/PropertyGrid'
import CinematicTimeline from '@/components/ui/CinematicTimeline'
import PriceTrends from '@/components/ui/PriceTrends'
import LeadersSection from '@/components/ui/LeadersSection'
import TestimonialsSection from '@/components/ui/TestimonialsSection'
import PageController from '@/components/ui/PageController'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useState, useEffect } from 'react'

export default function HomeClient() {
  const [showHeader, setShowHeader] = useState(false)

  useEffect(() => {
    const checkIntro = () => {
      const introEl = document.querySelector('.intro-section')
      setShowHeader(!introEl)
    }
    checkIntro()
    const observer = new MutationObserver(checkIntro)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {showHeader && <Header />}
      <main>
        <IntroSection />
        <PageController>
          <HeroSlider />
          <PropertyGrid />
          <CinematicTimeline />
          <PriceTrends />
          <LeadersSection />
          <TestimonialsSection />
        </PageController>
      </main>
      <Footer />
    </>
  )
}
