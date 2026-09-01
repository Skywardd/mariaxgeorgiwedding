import { useEffect, useMemo, useState } from 'react'
import { countdown, wedding } from '../content'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Heading from './ui/Heading'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function remainingUntil(target) {
  const diff = target - Date.now()
  if (diff <= 0) return null

  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
  }
}

const label = (value, forms) => (value === 1 ? forms.one : forms.many)

export default function Countdown() {
  const target = useMemo(() => new Date(wedding.dateISO).getTime(), [])
  const [left, setLeft] = useState(() => remainingUntil(target))

  useEffect(() => {
    if (!left) return
    const id = setInterval(() => setLeft(remainingUntil(target)), SECOND)
    return () => clearInterval(id)
  }, [target, left])

  return (
    <Section className="countdown">
      <Reveal>
        <Heading kicker={countdown.kicker} title={countdown.title} />

        {left ? (
          <div className="countdown__grid">
            {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
              <div key={unit}>
                <span className="countdown__value">{left[unit]}</span>
                <span className="countdown__label">
                  {label(left[unit], countdown.labels[unit])}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="countdown__done">{countdown.finished}</p>
        )}
      </Reveal>
    </Section>
  )
}
