'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './Header.css'

const navLinksLeft = [
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
]

const navLinksRight = [
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
]

const sideMenuLinks = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
]

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const location = { pathname: usePathname() }
  const isHome = location.pathname === '/'

  // On content pages the header is fixed and transparent; make it solid once
  // the user scrolls past the hero so page content doesn't collide with the nav.
  useEffect(() => {
    if (isHome) {
      setSolid(false)
      return
    }
    const onScroll = () => setSolid(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome, location.pathname])

  useEffect(() => {
    const updateNav = () => {
      // PageController: Hero=0, Property=1, Timeline=2
      const currentSection = (window as any).__pageControllerCurrentSection

      setScrolled(currentSection >= 1)
      // Hide header on the timeline section (index 2)
      setHidden(currentSection === 2)

      const nav = document.querySelector('.site-nav__inner') as HTMLElement
      if (nav) {
        nav.style.transition = 'padding 0.5s ease'
        // Left padding fixed at 15px; right padding stays wide/compact per section
        nav.style.paddingLeft = '15px'
        if (currentSection >= 1) {
          nav.style.paddingRight = '50px'
        } else {
          nav.style.paddingRight = '30px'
        }
      }
    }

    updateNav()
    // PageController dispatches this event on section change
    window.addEventListener('pageSectionChange', updateNav)
    return () => window.removeEventListener('pageSectionChange', updateNav)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <>
      <nav className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''} ${solid ? 'site-nav--solid' : ''} ${hidden ? 'site-nav--hidden' : ''}`}>
        <div className="site-nav__inner">
          {/* Left nav */}
          <div className="site-nav__left">
            <ul className="site-nav__links">
              {navLinksLeft.map((link, i) => (
                <li key={link.name} className="site-nav__item">
                  <Link
                    href={link.path}
                    className="site-nav__link"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Center logo */}
          <Link href="/" className="site-nav__logo">
            <img
              src="/omshakthy-logo.png"
              alt="OmShakthy Homes"
              className="site-nav__logo-img site-nav__logo-img--light"
            />
            <img
              src="/omshakthy-logo.png"
              alt="OmShakthy Homes"
              className="site-nav__logo-img site-nav__logo-img--dark"
            />
          </Link>

          {/* Right nav */}
          <div className="site-nav__right">
            <ul className="site-nav__links">
              {navLinksRight.map((link, i) => (
                <li key={link.name} className="site-nav__item">
                  <Link
                    href={link.path}
                    className="site-nav__link"
                    style={{ animationDelay: `${(i + 3) * 0.1}s` }}
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              className={`site-nav__hamburger ${menuOpen ? 'active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Side Menu */}
      <div className={`side-menu ${menuOpen ? 'side-menu--open' : ''}`}>
        <div className="side-menu__wrapper">
          <button
            className="side-menu__close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />
          <ul className="side-menu__options">
            {sideMenuLinks.map((link) => (
              <li key={link.name} className="side-menu__option">
                <Link href={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Header
