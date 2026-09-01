import { asset } from '../lib/asset'
import { witnesses } from '../content'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Heading from './ui/Heading'

/** Кумовете — тесен раздел между програмата и дрескода. */
export default function Witnesses() {
  return (
    <Section id="witnesses" narrow className="witnesses">
      <Reveal>
        <Heading kicker={witnesses.kicker} title={witnesses.title} />

        {witnesses.photo && (
          <figure className="witnesses__frame">
            <img
              src={asset(witnesses.photo)}
              alt=""
              width="360"
              height="255"
              loading="lazy"
              decoding="async"
            />
          </figure>
        )}

        <p className="witnesses__names">
          {witnesses.names[0]}
          <span className="witnesses__amp">{witnesses.separator}</span>
          {witnesses.names[1]}
        </p>
      </Reveal>
    </Section>
  )
}
