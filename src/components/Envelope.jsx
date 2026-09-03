import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/asset'
import { envelope, couple } from '../content'
import Logo from './ui/Logo'
import InviteDetails from './InviteDetails'

const HOLD_BEFORE_FLIGHT = 1100
const FLIGHT_DURATION = 800

/**
 * Връща страницата най-горе БЕЗ плавна анимация. Плавното превъртане е
 * включено за целия сайт, но тук би текло успоредно с измерването на
 * полета и пликът щеше да кацне накриво.
 */
const snapToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Envelope({ onOpen }) {
  const [opened, setOpened] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [fading, setFading] = useState(false)
  const [done, setDone] = useState(false)
  const openRef = useRef(null)

  // `onOpen` идва като нова функция при всяко пречертаване на App. Ако стои
  // в зависимостите, ефектът се пуска отново СЛЕД края на прехода и връща
  // гостa най-горе, докато той вече скролва. Затова се пази в ref.
  const onOpenRef = useRef(onOpen)
  onOpenRef.current = onOpen

  useEffect(() => {
    if (!opened) return

    const reduced = prefersReducedMotion()
    const timers = []

    const finish = () => {
      document.body.classList.remove('is-envelope-flying')
      onOpenRef.current?.()
      setDone(true)
    }

    const start = () => {
      // Страницата отдолу трябва да е най-горе ПРЕДИ да се измери целта:
      // така поканата се открива от логото нагоре, а пликът каца точно
      // където ще стои след това. Обратният ред води до подскок.
      snapToTop()

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

      // Полетът се задава направо върху елемента, а не през състояние на
      // React с `requestAnimationFrame`. При скрит раздел (гостът е сменил
      // приложението) кадрите спират, обратното извикване не се случва и
      // пликът оставаше на старото си място. Така крайните стойности се
      // записват веднага и мястото е вярно във всички случаи.
      Object.assign(el.style, {
        position: 'fixed',
        inset: 'auto',
        margin: '0',
        aspectRatio: 'auto',
        transform: 'none',
        transition: 'none',
        left: `${from.left}px`,
        top: `${from.top}px`,
        width: `${from.width}px`,
        height: `${from.height}px`,
      })

      // Принудително преизчисляване, за да е начална точка на прехода.
      void el.offsetWidth

      const ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)'
      el.style.transition = ['left', 'top', 'width', 'height']
        .map((p) => `${p} ${FLIGHT_DURATION}ms ${ease}`)
        .join(', ')
      el.style.left = `${to.left}px`
      el.style.top = `${to.top}px`
      el.style.width = `${to.width}px`
      el.style.height = `${to.height}px`

      setLeaving(true)
      timers.push(setTimeout(finish, FLIGHT_DURATION))
    }

    timers.push(setTimeout(start, reduced ? 300 : HOLD_BEFORE_FLIGHT))
    return () => {
      timers.forEach(clearTimeout)
      document.body.classList.remove('is-envelope-flying')
    }
  }, [opened])

  if (done) return null

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
        onClick={() => {
          // Ако страницата отдолу все пак е помръднала, я връщам най-горе.
          snapToTop()
          setOpened(true)
        }}
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
