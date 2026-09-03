import { rsvp } from '../content'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Heading from './ui/Heading'
import RsvpForm from './RsvpForm'

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`

export default function Rsvp() {
  return (
    <Section id="rsvp" narrow tint className="rsvp">
      <Reveal>
        <Heading kicker={rsvp.kicker} title={rsvp.title} />

        <p className="rsvp__deadline">{rsvp.deadline}</p>
        <p className="rsvp__note">{rsvp.note}</p>

        <RsvpForm />

        {rsvp.contacts.length > 0 && (
          <>
            <p className="rsvp__contacts-intro">{rsvp.contactsIntro}</p>
            <ul className="rsvp__contacts">
              {rsvp.contacts.map((contact) => (
                <li className="rsvp__contact" key={contact.name}>
                  <span>{contact.name}</span>
                  <a href={telHref(contact.phone)}>{contact.phone}</a>
                </li>
              ))}
            </ul>
          </>
        )}

        {rsvp.dayOf && (
          <p className="rsvp__day-of">
            {rsvp.dayOf.text} — {rsvp.dayOf.phoneLabel}{' '}
            <a href={telHref(rsvp.dayOf.phone)}>{rsvp.dayOf.phone}</a>
          </p>
        )}
      </Reveal>
    </Section>
  )
}
