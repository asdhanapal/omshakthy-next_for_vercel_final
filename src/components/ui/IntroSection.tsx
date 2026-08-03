'use client'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './IntroSection.css'

const IntroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [done, setDone] = useState(false) // intro finished + swiped away
  const [exiting, setExiting] = useState(false) // swipe-up transition running
  const finishedRef = useRef(false)

  // Play immediately, and make sure the intro always ends even if the video
  // can't start (blocked autoplay, decode error, missing file) — otherwise the
  // overlay would trap the page behind it.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let safety: ReturnType<typeof setTimeout> | null = null

    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      if (safety) clearTimeout(safety)
      // Start the hero slideshow behind the overlay so it's live on reveal.
      window.dispatchEvent(new Event('introComplete'))
      setTimeout(() => setExiting(true), 250)
    }

    const onMeta = () => {
      const ms = (Number.isFinite(video.duration) ? video.duration : 12) * 1000
      safety = setTimeout(finish, ms + 2000)
    }

    video.addEventListener('ended', finish)
    video.addEventListener('error', finish)
    video.addEventListener('loadedmetadata', onMeta)

    video.currentTime = 0
    video.play().catch(finish)

    return () => {
      if (safety) clearTimeout(safety)
      video.removeEventListener('ended', finish)
      video.removeEventListener('error', finish)
      video.removeEventListener('loadedmetadata', onMeta)
    }
  }, [])

  if (done) return <div className="intro-spacer" />

  return (
    <motion.section
      className="intro-section"
      initial={{ y: 0 }}
      animate={{ y: exiting ? '-100%' : 0 }}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        if (exiting) setDone(true)
      }}
    >
      <video
        ref={videoRef}
        className="intro-video"
        muted
        playsInline
        autoPlay
        preload="auto"
      >
        <source src="/intro-video.mp4" type="video/mp4" />
      </video>
    </motion.section>
  )
}

export default IntroSection
