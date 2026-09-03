import { useCallback, useEffect, useState } from 'react'
import { gallery, photos } from '../content'
import { photoUrl, thumbUrl } from '../lib/asset'
import useBodyLock from '../hooks/useBodyLock'
import Section from './ui/Section'
import Reveal from './ui/Reveal'
import Heading from './ui/Heading'

function Lightbox({ index, onClose, onPrev, onNext }) {
  useBodyLock(true)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  const photo = photos[index]

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={gallery.title}
      onClick={onClose}
    >
      <img
        className="lightbox__img"
        src={photoUrl(photo.file)}
        alt=""
        onClick={(event) => event.stopPropagation()}
      />

      <button
        type="button"
        className="lightbox__btn lightbox__btn--close"
        aria-label={gallery.closeLabel}
        onClick={onClose}
        autoFocus
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M2 2l12 12M14 2L2 14"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
          />
        </svg>
      </button>

      <button
        type="button"
        className="lightbox__btn lightbox__btn--prev"
        aria-label={gallery.prevLabel}
        onClick={(event) => {
          event.stopPropagation()
          onPrev()
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M10 2L4 8l6 6"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
          />
        </svg>
      </button>

      <button
        type="button"
        className="lightbox__btn lightbox__btn--next"
        aria-label={gallery.nextLabel}
        onClick={(event) => {
          event.stopPropagation()
          onNext()
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M6 2l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
          />
        </svg>
      </button>

      <span className="lightbox__counter">
        {index + 1} / {photos.length}
      </span>
    </div>
  )
}

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(
    () => setOpenIndex((i) => (i - 1 + photos.length) % photos.length),
    [],
  )
  const next = useCallback(() => setOpenIndex((i) => (i + 1) % photos.length), [])

  return (
    <Section id="gallery">
      <Reveal>
        <Heading kicker={gallery.kicker} title={gallery.title} />
      </Reveal>

      <div className="gallery__grid">
        {photos.map((photo, i) => (
          <button
            type="button"
            className="gallery__item"
            key={photo.file}
            onClick={() => setOpenIndex(i)}
            aria-label={`${gallery.kicker} ${gallery.title} — ${i + 1}`}
          >
            <img
              src={thumbUrl(photo.file)}
              width={photo.w}
              height={photo.h}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      {gallery.credit && (
        <Reveal>
          <p className="gallery__credit">
            {gallery.credit.label}:{' '}
            <a
              href={gallery.credit.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {gallery.credit.name}
            </a>
          </p>
        </Reveal>
      )}

      {openIndex !== null && (
        <Lightbox index={openIndex} onClose={close} onPrev={prev} onNext={next} />
      )}
    </Section>
  )
}
