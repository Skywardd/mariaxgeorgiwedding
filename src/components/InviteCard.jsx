import { asset } from '../lib/asset'
import { inviteCard } from '../content'
import InviteDetails from './InviteDetails'

export default function InviteCard() {
  return (

    <div className="invite__stage" data-invite-stage>
      <img
        className="invite__envelope"
        src={asset('assets/envelope-open.png')}
        alt={inviteCard.alt}
      />
      <InviteDetails />
    </div>
  )
}
