import { wedding } from '../content'

export default function InviteDetails() {
  return (
    <div className="invite__card">
      <p className="invite__month">{wedding.monthName}</p>

      <p className="invite__line">
        <span>{wedding.day}</span>
        <i aria-hidden="true" />
        <span className="invite__day">{wedding.dayNumber}</span>
        <i aria-hidden="true" />
        <span>{wedding.time}</span>
      </p>

      <p className="invite__address">{wedding.addressShort}</p>

      {wedding.hall && <p className="invite__hall">{wedding.hall}</p>}
    </div>
  )
}
