import { song } from '../content'
import Reveal from './ui/Reveal'
import Heading from './ui/Heading'

export default function Song() {
  if (!song.url) return null

  return (
    <section className="section song">
      <Reveal className="shell shell--narrow">
        <Heading kicker={song.kicker} title={song.title} />
        <a
          className="song__link"
          href={song.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="song__icon" aria-hidden="true">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
              <path d="M13 7.13a1 1 0 0 1 0 1.74l-11 6.2A1 1 0 0 1 .5 14.2V1.8A1 1 0 0 1 2 .93l11 6.2Z" />
            </svg>
          </span>
          <span className="song__cta">{song.cta}</span>
        </a>
      </Reveal>
    </section>
  )
}
