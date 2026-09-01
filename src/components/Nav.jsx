import { useEffect, useRef, useState } from 'react'
import { nav, navLabels } from '../content'
import useBodyLock from '../hooks/useBodyLock'
import Logo from './ui/Logo'

export default function Nav() {
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)
  const panelRef = useRef(null)

  useBodyLock(open)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.85)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    panelRef.current?.querySelector('a')?.focus()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <nav
      className={['nav', shown && 'is-shown', open && 'is-open']
        .filter(Boolean)
        .join(' ')}
      aria-label={navLabels.aria}
    >
      <div className="nav__bar">
        <Logo className="nav__logo" decorative />

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? navLabels.close : navLabels.open}
          onClick={() => setOpen((v) => !v)}
          ref={toggleRef}
        >
          <span className="nav__bars" aria-hidden="true" />
        </button>
      </div>

      <ul className="nav__list" id="nav-menu" ref={panelRef}>
        {nav.map((item) => (
          <li key={item.id}>
            <a
              className="nav__link"
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
