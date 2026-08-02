'use client'

import { useEffect, useState, type RefObject } from 'react'

/**
 * Fires once — the first time the PageController slide containing `ref`
 * becomes the active one.
 *
 * Why not IntersectionObserver / framer-motion's `whileInView`:
 * PageController is a `position: fixed`, `overflow: hidden` box that moves a
 * track with `transform: translateY(-N * 100vh)`. Every slide is in the DOM at
 * all times and the visual rects are governed by a transform on a clipping
 * ancestor, so intersection reporting is unreliable there.
 *
 * The pager already publishes exactly what we need, so we use that instead:
 *   window.__pageControllerCurrentSection   (see PageController.tsx)
 *   window 'pageSectionChange' event
 *
 * The slide index is derived from the DOM rather than hardcoded, so reordering
 * slides can't silently break this. (PageController already hardcodes index 2
 * for the timeline; one positional dependency is enough.)
 *
 * Outside a pager it simply plays after `delay`, so the same hook works on
 * ordinary scrolling pages.
 *
 * @param delay ms to wait after the slide lands. PageController's track
 *   transition is 700ms, so a short hold lets the slide settle first.
 */
export function useSectionEnter(
  ref: RefObject<HTMLElement | null>,
  delay = 300,
) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (entered) return

    const el = ref.current
    if (!el) return

    // Respect reduced motion by skipping straight to the final state.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEntered(true)
      return
    }

    const slide = el.closest('.page-controller__section')
    const track = slide?.parentElement

    let timer: ReturnType<typeof setTimeout>

    if (!slide || !track) {
      timer = setTimeout(() => setEntered(true), delay)
      return () => clearTimeout(timer)
    }

    const index = Array.prototype.indexOf.call(track.children, slide)

    const check = () => {
      const current =
        (window as unknown as { __pageControllerCurrentSection?: number })
          .__pageControllerCurrentSection ?? 0
      if (current !== index) return
      window.removeEventListener('pageSectionChange', check)
      timer = setTimeout(() => setEntered(true), delay)
    }

    check()
    window.addEventListener('pageSectionChange', check)

    return () => {
      window.removeEventListener('pageSectionChange', check)
      clearTimeout(timer)
    }
  }, [ref, delay, entered])

  return entered
}
