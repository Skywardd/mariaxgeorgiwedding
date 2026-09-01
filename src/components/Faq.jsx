import { useState } from 'react'
import { faq } from '../content'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Heading from './ui/Heading'

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <Section id="faq" className="faq">
      <Reveal>
        <Heading kicker={faq.kicker} title={faq.title} />
      </Reveal>

      <Reveal className="faq__list">
        {faq.items.map((item, i) => {
          const isOpen = openIndex === i
          const panelId = `faq-panel-${i}`

          return (
            <div
              className={['faq__item', isOpen && 'is-open'].filter(Boolean).join(' ')}
              key={item.q}
            >
              <h3>
                <button
                  type="button"
                  className="faq__question"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                >
                  {item.q}
                  <span className="faq__sign" aria-hidden="true" />
                </button>
              </h3>

              <div className="faq__answer" id={panelId} role="region">
                <div className="faq__answer-inner">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </Reveal>
    </Section>
  )
}
