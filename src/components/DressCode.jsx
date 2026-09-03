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

          {/* Нов ред в текста става нов абзац. */}
          <div className="prose">
            {dressCode.intro.split('\n').map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          {/* Списъкът с „Дами“ и „Господа“ е по избор — ако го няма
              в `content.js`, секцията просто остава без него. */}
          {dressCode.items?.length > 0 && (
            <dl className="dress__list">
              {dressCode.items.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          )}

          {dressCode.closing && (
            <p className="split__closing">{dressCode.closing}</p>
          )}
        </Reveal>
      </div>
    </Section>
  )
}
