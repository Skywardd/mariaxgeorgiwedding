import { asset } from '../lib/asset'
import { dressCode } from '../content'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Heading from './ui/Heading'

export default function DressCode() {
  return (
    <Section id="dress">
      <div className="split">
        <Reveal className="split__media">
          <img src={asset(dressCode.photo)} alt="" loading="lazy" />
        </Reveal>

        <Reveal className="split__body" delay={120}>
          <Heading kicker={dressCode.kicker} title={dressCode.title} />

          <div className="prose">
            <p>{dressCode.intro}</p>
          </div>

          <dl className="dress__list">
            {dressCode.items.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>

          <p className="split__closing">{dressCode.closing}</p>
        </Reveal>
      </div>
    </Section>
  )
}
