import { asset } from '../lib/asset'
import { story } from '../content'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Heading from './ui/Heading'

export default function Story() {
  return (
    <Section id="story" tint>
      <div className="split">
        <Reveal className="split__media">
          <img src={asset(story.photo)} alt="" loading="lazy" />
        </Reveal>

        <Reveal className="split__body" delay={120}>
          <Heading kicker={story.kicker} title={story.title} />
          <div className="prose">
            {story.paragraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
          <p className="split__closing">{story.closing}</p>
        </Reveal>
      </div>
    </Section>
  )
}
