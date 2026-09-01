import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/asset'
import { envelope, couple } from '../content'
import Logo from './ui/Logo'
import InviteDetails from './InviteDetails'

const HOLD_BEFORE_FLIGHT = 1100
const FLIGHT_DURATION = 800

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Envelope({ onOpen }) {
  const [opened, setOpened] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [fading, setFading] = useState(false)
  const [done, setDone] = useState(false)
  const [flight, setFlight] = useState(null)
  const openRef = useRef(null)

  useEffect(() => {
    if (!opened) return

    const reduced = prefersReducedMotion()
    const timers = []

    const finish = () => {
      document.body.classList.remove('is-envelope-flying')
      onOpen?.()
      setDone(true)
    }

    const start = () => {
      const el = openRef.current
      const target = document.querySelector('[data-invite-stage]')

      // Без анимация (или ако целта липсва) — просто меко изчезване.
      if (reduced || !el || !target) {
        setLeaving(true)
        setFading(true)
        timers.push(setTimeout(finish, reduced ? 250 : 600))
        return
      }

      const from = el.getBoundingClientRect()
      const to = target.getBoundingClientRect()

      document.body.classList.add('is-envelope-flying')
      setFlight({ ...from.toJSON(), moving: false })

      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setLeaving(true)
          setFlight({
            left: to.left,
            top: to.top,
            width: to.width,
            height: to.height,
            moving: true,
          })
        }),
      )

      timers.push(setTimeout(finish, FLIGHT_DURATION))
    }

    timers.push(setTimeout(start, reduced ? 300 : HOLD_BEFORE_FLIGHT))
    return () => {
      timers.forEach(clearTimeout)
      document.body.classList.remove('is-envelope-flying')
    }
  }, [opened, onOpen])

  if (done) return null

  const flightStyle = flight
    ? {
        position: 'fixed',
        inset: 'auto',
        margin: 0,
        left: `${flight.left}px`,
        top: `${flight.top}px`,
        width: `${flight.width}px`,
        height: `${flight.height}px`,
        aspectRatio: 'auto',
        transform: 'none',
        transition: flight.moving
          ? `left ${FLIGHT_DURATION}ms var(--ease), top ${FLIGHT_DURATION}ms var(--ease),` +
            ` width ${FLIGHT_DURATION}ms var(--ease), height ${FLIGHT_DURATION}ms var(--ease)`
          : 'none',
      }
    : undefined

  return (
    <div
      className={[
        'envelope',
        opened && 'is-open',
        leaving && 'is-leaving',
        fading && 'is-fading',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={leaving}
    >
      {/* Хартиеният фон е отделен слой, за да избледнее сам,
          докато пликът остава плътен. */}
      <span
        className="envelope__backdrop"
        style={{ backgroundImage: `url(${asset('assets/paper.jpg')})` }}
      />

      <Logo className="envelope__logo" />

      <p className="envelope__names">
        {couple.bride}
        <span className="envelope__amp">{envelope.separator}</span>
        {couple.groom}
      </p>

      <button
        type="button"
        className="envelope__button"
        onClick={() => setOpened(true)}
        disabled={opened}
      >
        <span className="envelope__art">
          <img
            className="envelope__img envelope__img--closed"
            src={asset('assets/envelope-closed.png')}
            alt={`Сватбена покана от ${couple.bride} и ${couple.groom}`}
          />

          <span
            className="envelope__open"
            ref={openRef}
            style={flightStyle}
            aria-hidden="true"
          >
            <img
              className="envelope__img envelope__img--open"
              src={asset('assets/envelope-open.png')}
              alt=""
            />
            <InviteDetails />
          </span>
        </span>

        <span className="envelope__cta">{envelope.cta}</span>
      </button>
    </div>
  )
}
