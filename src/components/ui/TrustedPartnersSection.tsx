'use client'
import { useEffect, useRef, useState } from 'react'
import { useSectionEnter } from '@/lib/useSectionEnter'
import './TrustedPartnersSection.css'

/* ============================================================
   TrustedPartnersSection
   "Trusted Developers in Chennai" — 5 service pillars, filling the
   whole snapped slide on its own (the header text and the Financial
   Partners strip both moved out — see FinancialPartnersSection, now
   rendered as its own page after this one in HomeClient).

   Reveal choreography matches Elyse's "amenities" section exactly,
   including both images per pillar (not just the big one):
     - the FIRST pillar's big image slides+fades in once, and its
       small image wipes in via a clip-path reveal
     - every pillar switch after that reveals the new big image
       through a 30-slice mask-image gradient that wipes down over
       the previous one, and the new small image through a clip-path
       wipe — both stacked in DOM order, so a later pillar's image
       visually covers whatever was showing before (no crossfade
       needed); going backward un-wipes the same way in reverse to
       expose the pillar beneath it
     - the title/description swap via SplitText line-masking: the
       outgoing lines slide up and out, the incoming lines slide up
       from below, staggered per line — not a plain opacity fade

   Elyse drives all of this off scroll position (ScrollTrigger scrub).
   This section is one of PageController's snapped 100vh slides (see
   HomeClient), which owns the wheel and jumps between whole sections
   via a translateY transform — there's no real scroll distance inside
   it to scrub against. So, exactly like CinematicTimeline does for its
   horizontal milestones, this exposes a window.__tpGalleryAdvance(dir)
   hook that PageController calls first: while there's another pillar
   left in that direction it's "consumed" (steps the active index,
   which triggers the reveal/hide timelines below by hand instead of by
   scrub) and section navigation is blocked; only at the first/last
   pillar does the wheel tick fall through to actually change pages.
   ============================================================ */

const pillars = [
  {
    title: 'Land Aggregation',
    desc: 'Immense knowledge of land and its value, sound research and extended expertise in the realms of real estate properties.',
    image: '/tp/tp-land-aggregation.jpg',
    smallImage: '/tp/tp-small-masterplan.jpg',
  },
  {
    title: 'Residential Development',
    desc: 'Utmost care in revitalization efforts to improve community life across all residential projects that are undertaken.',
    image: '/tp/tp-residential.jpg',
    smallImage: '/tp/tp-small-residential.jpg',
  },
  {
    title: 'Hospitality Management',
    desc: 'Qualified and well trained individuals that provide quick and relevant solutions for all forms of support services.',
    image: '/tp/tp-hospitality-facade.jpg',
    smallImage: '/tp/tp-hospitality.jpg',
  },
  {
    title: 'Commercial Projects',
    desc: 'Complete transparency in price, regulations, schedule and documentation allows for smooth execution of commercial projects.',
    image: '/tp/tp-commercial.jpg',
    smallImage: '/tp/tp-small-commercial.jpg',
  },
  {
    title: 'Supply Chain Management',
    desc: 'Complete transparency in price, regulations, schedule and documentation allows for smooth execution of commercial projects.',
    image: '/tp/tp-supply-chain.jpg',
    smallImage: '/tp/tp-small-supply-chain.jpg',
  },
]

const NUM_PILLARS = pillars.length

// Same technique as Elyse's generateMaskGradient(): slice the image into
// MASK_SLICES horizontal bands and build a mask-image gradient where each
// band is opaque up to its own progress (0–1). Animating those progress
// values with a small per-slice stagger produces the wipe-down reveal.
const MASK_SLICES = 30
function buildSliceMask(progressArr: number[]) {
  const step = 100 / MASK_SLICES
  let css = 'linear-gradient(0deg'
  for (let i = 0; i < MASK_SLICES; i++) {
    const start = i * step
    const p = progressArr[i]
    const visibleEnd = start + step * p
    css += `, #000 ${start}% ${visibleEnd}%`
    if (p < 1) css += `, transparent ${visibleEnd}% ${start + step}%`
  }
  return css + ')'
}

const TrustedPartnersSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const built = useSectionEnter(sectionRef, 150)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const prevActiveRef = useRef(0)

  // DOM refs the GSAP timelines below reach into directly (same as Elyse
  // grabbing bigImages/smallImages/textBoxes via gsap.utils.toArray).
  const bigImgRefs = useRef<(HTMLImageElement | null)[]>([])
  const smallImgRefs = useRef<(HTMLImageElement | null)[]>([])
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const splitTitlesRef = useRef<any[]>([])
  const splitDescsRef = useRef<any[]>([])
  // Which pillar's images (both big and small) are currently fully
  // revealed. Index 0 is handled by the one-off slide+fade/clip-path
  // entrance instead of the wipe timelines, so it never needs this flag.
  const revealedRef = useRef<boolean[]>(new Array(NUM_PILLARS).fill(false))
  // The big-image reveal/hide tweens a plain JS array (see buildSliceMask),
  // not the <img> element itself, so GSAP's automatic same-target overwrite
  // doesn't apply — two calls in a row for the same index create two fully
  // independent timelines that will race to write mask-image on every tick.
  // Track the in-flight one per index and kill it before starting another,
  // or a fast forward-then-back (or a rapid resync in general) leaves the
  // image stuck showing whichever timeline happened to keep ticking longest.
  const bigTimelineRefs = useRef<any[]>(new Array(NUM_PILLARS).fill(null))
  const hasAnimatedFirstRef = useRef(false)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  // Expose a handler PageController can call before it moves sections.
  // Returns true if the gallery consumed the wheel tick (another pillar
  // left in that direction), false at a boundary so PageController falls
  // through to its normal section-change / release-to-native-scroll logic.
  useEffect(() => {
    (window as any).__tpGalleryAdvance = (dir: number) => {
      const next = activeRef.current + dir
      if (next >= 0 && next < NUM_PILLARS) {
        setActive(next)
        return true // consumed
      }
      return false // boundary — let the page move
    }
    // Lets PageController reset the gallery to the first pillar once the
    // user has scrolled away from it, so re-entering starts fresh.
    //
    // This is a jump, not a step — active can be sitting on any pillar
    // (2, 3, 4...) when it fires, unlike __tpGalleryAdvance which only
    // ever moves one index at a time. The transition effect below only
    // knows how to un-reveal a single `prev` index per change, so just
    // calling setActive(0) here would leave every pillar *between* the
    // old active and 0 stuck fully revealed (confirmed: this is exactly
    // what caused pillars 1–3 to all render fully visible at once).
    // Force every non-zero pillar back to its hidden resting state
    // directly instead of routing this through that effect.
    ;(window as any).__tpGalleryReset = () => {
      if (activeRef.current === 0) return
      ;(async () => {
        const { default: gsap } = await import('gsap')
        for (let i = 1; i < NUM_PILLARS; i++) {
          const bigImg = bigImgRefs.current[i]
          if (bigImg) {
            const hidden = buildSliceMask(new Array(MASK_SLICES).fill(0))
            bigImg.style.setProperty('-webkit-mask-image', hidden)
            bigImg.style.setProperty('mask-image', hidden)
          }
          const smallImg = smallImgRefs.current[i]
          if (smallImg) gsap.set(smallImg, { clipPath: 'inset(100% 0% 0% 0%)' })
          const lines = [...(splitTitlesRef.current[i]?.lines ?? []), ...(splitDescsRef.current[i]?.lines ?? [])]
          if (lines.length) gsap.set(lines, { yPercent: 100 })
          const slide = slideRefs.current[i]
          if (slide) gsap.set(slide, { opacity: 0, visibility: 'hidden' })
          revealedRef.current[i] = false
        }
        const slide0 = slideRefs.current[0]
        if (slide0) gsap.set(slide0, { opacity: 1, visibility: 'visible' })
      })()
      // Sync prevActiveRef first so the [active] transition effect below
      // sees prev === active === 0 on this update and no-ops instead of
      // trying to (incorrectly) single-step-animate a multi-index jump.
      prevActiveRef.current = 0
      setActive(0)
    }
    return () => {
      delete (window as any).__tpGalleryAdvance
      delete (window as any).__tpGalleryReset
    }
  }, [])

  // One-time setup: hide everything that the entrance/transition
  // timelines are responsible for revealing, mirroring Elyse's initial
  // gsap.set() calls (mask-gradient at 0 for big images 1..N, clip-path
  // closed for every small image, split lines pushed down out of view).
  useEffect(() => {
    const splitT: any[] = []
    const splitD: any[] = []

    const setup = async () => {
      const { default: gsap } = await import('gsap')
      const { SplitText } = await import('gsap/SplitText')
      gsap.registerPlugin(SplitText)

      bigImgRefs.current.forEach((img, i) => {
        if (!img) return
        if (i === 0) {
          gsap.set(img, { x: 60, opacity: 0 })
        } else {
          const hiddenMask = buildSliceMask(new Array(MASK_SLICES).fill(0))
          img.style.setProperty('-webkit-mask-image', hiddenMask)
          img.style.setProperty('mask-image', hiddenMask)
        }
      })

      gsap.set(smallImgRefs.current, { clipPath: 'inset(100% 0% 0% 0%)' })

      titleRefs.current.forEach((el, i) => {
        if (!el) return
        // linesClass so each generated line wrapper can get bottom padding
        // in CSS (.tp__split-line) — without it, descenders like the "g"
        // in "Aggregation" get clipped by the line mask's overflow:hidden.
        const split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'tp__split-line' })
        gsap.set(split.lines, { yPercent: 100 })
        splitT[i] = split
      })
      descRefs.current.forEach((el, i) => {
        if (!el) return
        const split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'tp__split-line' })
        gsap.set(split.lines, { yPercent: 100 })
        splitD[i] = split
      })
      splitTitlesRef.current = splitT
      splitDescsRef.current = splitD

      // Every pillar box starts hidden; the entrance effect below reveals
      // pillar 0's the moment the section actually comes into view.
      gsap.set(slideRefs.current, { opacity: 0, visibility: 'hidden' })
    }

    setup()

    return () => {
      splitT.forEach((s) => s?.revert())
      splitD.forEach((s) => s?.revert())
    }
  }, [])

  // Entrance — plays once, the first time the section actually scrolls
  // into view (mirrors Elyse's ScrollTrigger onEnter + hasAnimatedFirst
  // guard), not on mount (PageController keeps this section mounted but
  // translated off-screen until the user reaches it).
  useEffect(() => {
    if (!built || hasAnimatedFirstRef.current) return
    hasAnimatedFirstRef.current = true
    revealedRef.current[0] = true

    ;(async () => {
      const { default: gsap } = await import('gsap')

      if (bigImgRefs.current[0]) {
        gsap.to(bigImgRefs.current[0], { x: 0, opacity: 1, duration: 1.2, ease: 'power2.out' })
      }
      if (smallImgRefs.current[0]) {
        gsap.to(smallImgRefs.current[0], {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.2,
        })
      }

      const slide0 = slideRefs.current[0]
      if (slide0) gsap.set(slide0, { opacity: 1, visibility: 'visible' })

      const tl = gsap.timeline({ delay: 0.3 })
      if (splitTitlesRef.current[0]) {
        tl.to(splitTitlesRef.current[0].lines, { yPercent: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' })
      }
      if (splitDescsRef.current[0]) {
        tl.to(
          splitDescsRef.current[0].lines,
          { yPercent: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
          '-=0.5'
        )
      }
    })()
  }, [built])

  // Transition — fires on every active-pillar change instead of Elyse's
  // scroll-scrub, playing the same reveal/hide timelines by hand.
  useEffect(() => {
    const prev = prevActiveRef.current
    prevActiveRef.current = active
    if (prev === active || !hasAnimatedFirstRef.current) return

    const dir = active > prev ? 1 : -1

    ;(async () => {
      const { default: gsap } = await import('gsap')

      // --- big image: wipe the incoming one in (30-slice mask), or
      // un-wipe the outgoing one to expose the (already-revealed) pillar
      // underneath. Small image mirrors it with a plain clip-path wipe —
      // same idea, Elyse just used the simpler technique for that one. ---
      if (dir === 1 && !revealedRef.current[active]) {
        const img = bigImgRefs.current[active]
        if (img) {
          const p = new Array(MASK_SLICES).fill(0)
          const tl = gsap.timeline({
            onUpdate: () => {
              const css = buildSliceMask(p)
              img.style.setProperty('-webkit-mask-image', css)
              img.style.setProperty('mask-image', css)
            },
          })
          for (let i = 0; i < MASK_SLICES; i++) {
            tl.to(p, { [i]: 1, duration: 0.4, ease: 'none' }, i * 0.012)
          }
        }
        const small = smallImgRefs.current[active]
        if (small) {
          gsap.to(small, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.out' })
        }
        revealedRef.current[active] = true
      } else if (dir === -1 && prev !== 0) {
        const img = bigImgRefs.current[prev]
        if (img) {
          const p = new Array(MASK_SLICES).fill(1)
          const tl = gsap.timeline({
            onUpdate: () => {
              const css = buildSliceMask(p)
              img.style.setProperty('-webkit-mask-image', css)
              img.style.setProperty('mask-image', css)
            },
          })
          for (let i = MASK_SLICES - 1; i >= 0; i--) {
            tl.to(p, { [i]: 0, duration: 0.35, ease: 'none' }, (MASK_SLICES - 1 - i) * 0.012)
          }
        }
        const small = smallImgRefs.current[prev]
        if (small) {
          gsap.to(small, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.6, ease: 'power2.in' })
        }
        revealedRef.current[prev] = false
      }

      // --- text: outgoing lines slide up and out, incoming lines slide
      // up from below, staggered per line. ---
      const outTitle = splitTitlesRef.current[prev]?.lines
      const outDesc = splitDescsRef.current[prev]?.lines
      const inTitle = splitTitlesRef.current[active]?.lines
      const inDesc = splitDescsRef.current[active]?.lines
      const outSlide = slideRefs.current[prev]
      const inSlide = slideRefs.current[active]

      const tl = gsap.timeline()
      if (outTitle) tl.to(outTitle, { yPercent: -100, duration: 0.3, stagger: 0.02, ease: 'power2.in' })
      if (outDesc) tl.to(outDesc, { yPercent: -100, duration: 0.3, stagger: 0.02, ease: 'power2.in' }, '<')
      if (outSlide) tl.set(outSlide, { opacity: 0, visibility: 'hidden' })
      if (inSlide) tl.set(inSlide, { opacity: 1, visibility: 'visible' })
      if (inTitle) tl.fromTo(inTitle, { yPercent: 100 }, { yPercent: 0, duration: 0.45, stagger: 0.05, ease: 'power3.out' })
      if (inDesc) {
        tl.fromTo(
          inDesc,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.35, stagger: 0.04, ease: 'power3.out' },
          '-=0.25'
        )
      }
    })()
  }, [active])

  const progress = active / (NUM_PILLARS - 1)

  return (
    <section ref={sectionRef} className="tp" aria-label="Trusted developers in Chennai" data-header-theme="light">
      <div className="tp__inner">
        {/* Waves background */}
        <div className="tp__waves" aria-hidden>
          <div className="tp__wave tp__wave--1">
            <svg viewBox="0 0 2880 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,600 C240,540 480,660 720,600 C960,540 1200,660 1440,600 C1680,540 1920,660 2160,600 C2400,540 2640,660 2880,600 L2880,900 L0,900 Z" fill="rgba(4,153,222,0.09)" />
              <path d="M0,650 C240,610 480,690 720,650 C960,610 1200,690 1440,650 C1680,610 1920,690 2160,650 C2400,610 2640,690 2880,650 L2880,900 L0,900 Z" fill="rgba(4,153,222,0.055)" />
            </svg>
          </div>
          <div className="tp__wave tp__wave--2">
            <svg viewBox="0 0 2880 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,500 C240,440 480,560 720,500 C960,440 1200,560 1440,500 C1680,440 1920,560 2160,500 C2400,440 2640,560 2880,500 L2880,900 L0,900 Z" fill="rgba(4,153,222,0.07)" />
              <path d="M0,560 C240,510 480,610 720,560 C960,510 1200,610 1440,560 C1680,510 1920,610 2160,560 C2400,510 2640,610 2880,560 L2880,900 L0,900 Z" fill="rgba(4,153,222,0.045)" />
            </svg>
          </div>
          <div className="tp__wave tp__wave--3">
            <svg viewBox="0 0 2880 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,700 C240,660 480,740 720,700 C960,660 1200,740 1440,700 C1680,660 1920,740 2160,700 C2400,660 2640,740 2880,700 L2880,900 L0,900 Z" fill="rgba(11,31,58,0.055)" />
              <path d="M0,740 C240,710 480,770 720,740 C960,710 1200,770 1440,740 C1680,710 1920,770 2160,740 C2400,710 2640,770 2880,740 L2880,900 L0,900 Z" fill="rgba(11,31,58,0.035)" />
            </svg>
          </div>
        </div>

        {/* Amenities-style gallery — the only content in this slide now.
            The active pillar's title is the big serif headline
            (crossfades per pillar, like Elyse's "Wellness-centered
            amenities" / "Art inspired spaces" treatment) beside two
            genuinely overlapping/offset images, both of which swap per
            pillar, stepped via the __tpGalleryAdvance wheel hook above. */}
        <div className="tp__gallery">
          <div className="tp__gallery-stage" id="tpGalleryStage">
            <div className="tp__gallery-copy">
              <span
                className="tp__gallery-rail-fill"
                style={{ height: `${progress * 100}%` }}
                aria-hidden="true"
              />

              <span className="tp__gallery-eyebrow">What We Do</span>

              <div className="tp__gallery-slides">
                {pillars.map((p, i) => (
                  <div
                    className="tp__gallery-slide"
                    key={p.title}
                    ref={(el) => { slideRefs.current[i] = el }}
                  >
                    <h3
                      className="tp__gallery-title"
                      ref={(el) => { titleRefs.current[i] = el }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="tp__gallery-desc"
                      ref={(el) => { descRefs.current[i] = el }}
                    >
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="tp__gallery-visual">
              <div className="tp__gallery-frame tp__gallery-frame--big">
                {pillars.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={p.title}
                    src={p.image}
                    alt={p.title}
                    className="tp__gallery-img"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    ref={(el) => { bigImgRefs.current[i] = el }}
                  />
                ))}
              </div>

              <div className="tp__gallery-frame tp__gallery-frame--small">
                {pillars.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={p.title}
                    src={p.smallImage}
                    alt={`${p.title} — detail`}
                    className="tp__gallery-img"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    ref={(el) => { smallImgRefs.current[i] = el }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustedPartnersSection
