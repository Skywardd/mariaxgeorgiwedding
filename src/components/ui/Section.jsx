export default function Section({
  id,
  className = '',
  tint = false,
  narrow = false,
  children,
}) {
  return (
    <section
      id={id}
      className={['section', tint && 'section--tint', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={['shell', narrow && 'shell--narrow'].filter(Boolean).join(' ')}>
        {children}
      </div>
    </section>
  )
}
