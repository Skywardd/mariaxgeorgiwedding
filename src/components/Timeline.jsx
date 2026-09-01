import { timeline } from '../content'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Heading from './ui/Heading'

/**
 * Програмата на деня — часовете се редуват отляво и отдясно на
 * вертикална линия.
 */
export default function Timeline() {
  return (
    <Section id="timeline" className="timeline">
      <Reveal>
        <Heading kicker={timeline.kicker} title={timeline.title} />
      </Reveal>

      <ol className="timeline__list">
        {timeline.items.map((item, i) => {
          const timeFirst = i % 2 === 0
          return (
            <Reveal
              as="li"
              key={`${item.time}-${item.label}`}
              className="timeline__item"
              delay={i * 60}
            >
              {timeFirst ? (
                <>
                  <span className="timeline__time">{item.time}</span>
                  <span className="timeline__dot" aria-hidden="true" />
                  <span className="timeline__label">{item.label}</span>
                </>
              ) : (
                <>
                  <span className="timeline__label">{item.label}</span>
                  <span className="timeline__dot" aria-hidden="true" />
                  <span className="timeline__time">{item.time}</span>
                </>
              )}
            </Reveal>
          )
        })}
      </ol>

      {timeline.closing && (
        <Reveal>
          <p className="timeline__closing">{timeline.closing}</p>
        </Reveal>
      )}
    </Section>
  )
}
