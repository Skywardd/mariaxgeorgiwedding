import { footer, wedding } from '../content'
import Reveal from './ui/Reveal'
import Logo from './ui/Logo'

export default function Footer() {
  return (
    <footer className="footer">
      <Reveal>
        <Logo className="footer__logo" />

        <p className="footer__date">
          {wedding.dayNumber} {wedding.monthName} {wedding.year}
        </p>

        {footer.credit && (
          <p className="footer__credit">
            {footer.credit.label}: {footer.credit.name}
          </p>
        )}

        <a className="footer__top" href="#top">
          {footer.backToTop}
        </a>
      </Reveal>
    </footer>
  )
}
