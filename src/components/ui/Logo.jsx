import { assetUrl } from '../../lib/asset'
import { couple } from '../../content'

/**
 * Монограмът от `G.svg`. Файлът е черен, затова се показва през CSS маска —
 * цветът идва от `--logo-color` и се задава от мястото, където стои логото.
 */
export default function Logo({ className = '', decorative = false }) {
  return (
    <span
      className={['logo', className].filter(Boolean).join(' ')}
      style={{ '--logo': `url(${assetUrl('assets/monogram.svg')})` }}
      {...(decorative
        ? { 'aria-hidden': 'true' }
        : {
            role: 'img',
            'aria-label': `Монограм на ${couple.bride} и ${couple.groom}`,
          })}
    />
  )
}
