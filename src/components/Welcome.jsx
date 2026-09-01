import { couple, welcome } from '../content'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Heading from './ui/Heading'

export default function Welcome() {
  return (
    <Section id="welcome" narrow className="welcome">
      <Reveal>
        <Heading kicker={welcome.kicker} title={welcome.title} />

        <div className="prose prose--center">
          {welcome.paragraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>

        <div className="welcome__signature">
          <p className="welcome__sign-off">{welcome.signOff}</p>
          <p className="welcome__sign-name">
            {welcome.signature} {couple.familyName}
          </p>
        </div>
      </Reveal>
    </Section>
  )
}
