import { useEffect } from 'react'

import Envelope from './components/Envelope'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Song from './components/Song'
import Welcome from './components/Welcome'
import Countdown from './components/Countdown'
import Story from './components/Story'
import Venue from './components/Venue'
import Timeline from './components/Timeline'
import Witnesses from './components/Witnesses'
import DressCode from './components/DressCode'
import Gifts from './components/Gifts'
import Rsvp from './components/Rsvp'
import Faq from './components/Faq'
import Gallery from './components/Gallery'
import Footer from './components/Footer'

export default function App() {
  // Поканата винаги започва от плика най-горе. Иначе при презареждане
  // браузърът връща предишната позиция и гостът се озовава по средата.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    // Без плавно превъртане — при зареждане то се вижда като ненужно
    // плъзгане на страницата.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      {/* Пликът НЕ заключва страницата. На iOS `overflow: hidden` върху
          body не спира плъзгането, но клампва `scrollY` до нула — тогава
          връщането най-горе е привидно и поканата се откриваше по средата.
          Движението се спира с `touch-action` върху самия плик, а точната
          позиция — с превъртане най-горе преди измерването на полета. */}
      <Envelope />

      <Nav />

      <main>
        <Hero />
        <Song />
        <Welcome />
        <Countdown />
        <Story />
        <Venue />
        <Timeline />
        <Witnesses />
        <DressCode />
        <Gifts />
        <Rsvp />
        <Faq />
        <Gallery />
      </main>

      <Footer />
    </>
  )
}
