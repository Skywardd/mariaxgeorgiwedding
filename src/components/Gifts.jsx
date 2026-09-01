import { gifts } from '../content'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Heading from './ui/Heading'

export default function Gifts() {
  return (
    <Section id="gifts" narrow className="gifts">
      <Reveal>
        <Heading kicker={gifts.kicker} title={gifts.title} />

        <div className="prose prose--center">
          {gifts.paragraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>

        {gifts.link.url && (
          <a
            className="btn btn--solid"
            href={gifts.link.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            {gifts.link.label}
          </a>
        )}
      </Reveal>
    </Section>
  )
}
