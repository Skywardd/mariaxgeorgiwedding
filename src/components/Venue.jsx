import { asset } from '../lib/asset'
import { venue } from '../content'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Heading from './ui/Heading'

/**
 * Двете места на деня — венчавката и празненството, всяко със
 * собствен линк към картата.
 */
export default function Venue() {
  return (
    <Section id="venue">
      <div className="split split--reverse">
        <Reveal className="split__media">
          <img src={asset(venue.photo)} alt="" loading="lazy" />
        </Reveal>

        <Reveal className="split__body" delay={120}>
          <Heading kicker={venue.kicker} title={venue.title} />

          <div className="venue__blocks">
            {venue.blocks.map((block) => (
              <div className="venue__block" key={block.title}>
                <h3 className="venue__block-title">{block.title}</h3>

                <p className="venue__name">{block.place}</p>

                <p className="venue__meta">
                  {block.note && <span>{block.note}</span>}
                  <span className="venue__time">{block.time}</span>
                </p>

                {block.mapsUrl && (
                  <a
                    className="venue__map"
                    href={block.mapsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {venue.mapsCta}
                  </a>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
