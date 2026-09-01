import { asset } from '../lib/asset'
import { couple, hero } from '../content'
import Reveal from './ui/Reveal'
import Logo from './ui/Logo'
import InviteCard from './InviteCard'

export default function Hero() {
  return (
    <header className="hero" id="top">
      <img
        className="hero__bg"
        src={asset(hero.photo)}
        alt={`${couple.bride} и ${couple.groom}`}
        fetchpriority="high"
      />

      <Reveal className="hero__inner">
        <Logo className="hero__logo" decorative />

        <p className="hero__kicker">{hero.kicker}</p>

        <h1 className="hero__names">
          <span className="hero__name">{couple.bride}</span>
          <span className="hero__amp">и</span>
          <span className="hero__name">{couple.groom}</span>
        </h1>

        <p className="hero__invite">{hero.invite}</p>

        <InviteCard />
      </Reveal>
    </header>
  )
}
