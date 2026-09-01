/**
 * Заглавие в стила на поканата: разредени главни букви отгоре,
 * ръкописна дума отдолу.
 */
export default function Heading({ kicker, title, light = false, as: Tag = 'h2' }) {
  return (
    <Tag className={['heading', light && 'heading--light'].filter(Boolean).join(' ')}>
      <span className="heading__kicker">{kicker}</span>
      <span className="heading__title">{title}</span>
    </Tag>
  )
}
