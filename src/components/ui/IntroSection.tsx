'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import './IntroSection.css'

// Preloader timing
const HOLD_MS = 1600 // keyhole waits for a scroll before it auto-opens
const UNLOCK_MS = 2000 // full auto-open duration (also used for scroll-driven finish)
const IDLE_RESUME_MS = 900 // after a partial scroll, resume auto-open if the user pauses
const VIDEO_START_AT = 0.55 // start the video once the keyhole reveal passes 55%

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

const IntroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [done, setDone] = useState(false) // whole intro finished + swiped away
  const [exiting, setExiting] = useState(false) // swipe-up transition running
  const [loaderHidden, setLoaderHidden] = useState(false) // remove loader + start video

  // 0 = keyhole closed, 1 = fully open
  const progress = useMotionValue(0)
  const keyScale = useTransform(progress, [0, 1], [1, 22])
  const boxY = useTransform(progress, [0, 1], [0, 40])
  const boxOpacity = useTransform(progress, [0, 0.55], [1, 0])

  // mutable control refs
  const interactedRef = useRef(false)
  const completedRef = useRef(false)
  const videoStartedRef = useRef(false)
  const autoRef = useRef<ReturnType<typeof animate> | null>(null)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const video = videoRef.current
    // Show the first frame through the keyhole without playing yet
    if (video) {
      video.pause()
      try {
        video.currentTime = 0
      } catch {
        /* ignore */
      }
    }

    const finish = () => {
      if (completedRef.current) return
      completedRef.current = true
      autoRef.current?.stop()
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      setLoaderHidden(true)
      // Video has already started at VIDEO_START_AT; ensure it's playing.
      startVideo()
    }

    // Start the intro video once (used when the keyhole reveal passes 70%)
    const startVideo = () => {
      if (videoStartedRef.current) return
      videoStartedRef.current = true
      const v = videoRef.current
      if (v) {
        v.currentTime = 0
        v.play().catch(() => {})
      }
    }

    // Begin playback as soon as the reveal crosses the 70% threshold
    const unsub = progress.on('change', (v) => {
      if (v >= VIDEO_START_AT) startVideo()
    })

    // Auto-open the remaining distance (used when the user doesn't scroll)
    const startAuto = () => {
      if (completedRef.current) return
      const remaining = 1 - progress.get()
      if (remaining <= 0) return finish()
      autoRef.current = animate(progress, 1, {
        duration: (UNLOCK_MS / 1000) * remaining,
        ease: 'easeIn',
        onComplete: finish,
      })
    }

    // Scroll / wheel drives the keyhole open
    const drive = (delta: number) => {
      if (completedRef.current) return
      interactedRef.current = true
      autoRef.current?.stop()
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)

      const next = clamp(progress.get() + delta, 0, 1)
      progress.set(next)

      if (next >= 1) {
        finish()
      } else {
        // if the user pauses mid-scroll, resume the auto-open
        idleTimerRef.current = setTimeout(startAuto, IDLE_RESUME_MS)
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      drive(e.deltaY * 0.0009)
    }

    let lastTouchY: number | null = null
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? null
    }
    const onTouchMove = (e: TouchEvent) => {
      if (lastTouchY == null) return
      const y = e.touches[0]?.clientY ?? lastTouchY
      drive((lastTouchY - y) * 0.0022)
      lastTouchY = y
    }

    // Auto-open after the hold if nobody has scrolled
    const holdTimer = setTimeout(() => {
      if (!interactedRef.current) startAuto()
    }, HOLD_MS)

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      clearTimeout(holdTimer)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      autoRef.current?.stop()
      unsub()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [progress])

  // Video finished → start the hero behind, then smoothly swipe the intro up
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      // Start the hero slideshow behind the overlay so it's live as we reveal it
      window.dispatchEvent(new Event('introComplete'))
      // Hold the last frame briefly, then trigger the swipe-up transition
      setTimeout(() => setExiting(true), 250)
    }

    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
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
      <video ref={videoRef} className="intro-video" muted playsInline preload="auto">
        <source src="/intro-video.mp4" type="video/mp4" />
      </video>

      {/* Keyhole unlock preloader — Heritage Indigo, scroll-to-unlock.
          Same animation as before (ink surround, keyhole scales 1→22 from
          viewport centre) but drawn as a vector mask so the edge stays crisp
          instead of upscaling a rasterized background image. */}
      {!loaderHidden && (
        <div className="intro-loader">
          <svg
            className="intro-loader-mask"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="introInk" x1="960" y1="0" x2="960" y2="1080" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0B1F3A" />
                <stop offset="1" stopColor="#060D18" />
              </linearGradient>
              <mask id="introKeyhole">
                <rect x="0" y="0" width="1920" height="1080" fill="white" />
                <motion.path
                  d="M884.359 456.321C884.359 482.773 897.817 506.083 918.259 519.776L888 699H1032L1003.14 519.747C1023.56 506.05 1037 482.755 1037 456.321C1037 414.17 1002.83 380 960.679 380C918.529 380 884.359 414.17 884.359 456.321Z"
                  fill="black"
                  style={{ scale: keyScale, transformBox: 'view-box', transformOrigin: '960px 540px' }}
                />
              </mask>
            </defs>
            <rect x="0" y="0" width="1920" height="1080" fill="url(#introInk)" mask="url(#introKeyhole)" />
          </svg>
          <motion.div className="intro-loader-box" style={{ y: boxY, opacity: boxOpacity }}>
            <div className="intro-line">
              <div className="intro-line-inner">Generating Real Assets</div>
            </div>
            <div className="intro-line">
              <div className="intro-line-inner">Land that outlives the owner.</div>
            </div>
            <div className="intro-key-wrap">
              <div className="intro-key" />
            </div>
            <div className="intro-hint">Scroll to enter</div>
          </motion.div>
        </div>
      )}
    </motion.section>
  )
}

export default IntroSection
